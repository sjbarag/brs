import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { XmlDocument, XmlElement } from "xmldoc";
import pSettle = require("p-settle");
const readFile = promisify(fs.readFile);
import * as fg from "fast-glob";
import { Environment } from "../interpreter/Environment";

interface FieldAttributes {
    id: string;
    type: string;
    alias?: string;
    value?: string;
    onChange?: string;
    alwaysNotify?: string;
}

interface ComponentField {
    [key: string]: FieldAttributes;
}

interface NodeField {
    [id: string]: string;
}

interface ComponentNode {
    name: string;
    fields: NodeField;
    children: ComponentNode[];
}

export interface ComponentScript {
    type: string;
    uri: string;
}

export class ComponentDefinition {
    public contents?: string;
    public xmlNode?: XmlDocument;
    public name?: string;
    // indicates whether this component hierarchy has been processed before
    // which means the fields, children, and inherited functions are correctly set
    public processed: boolean = false;
    public fields: ComponentField = {};
    public children: ComponentNode[] = [];
    public scripts: ComponentScript[] = [];
    public environment: Environment | undefined;

    constructor(readonly xmlPath: string) {}

    async parse(): Promise<ComponentDefinition> {
        let contents;
        try {
            contents = await readFile(this.xmlPath, "utf-8");
            let xmlStr = contents.toString().replace(/\r?\n|\r/g, "");
            this.xmlNode = new XmlDocument(xmlStr);
            this.name = this.xmlNode.attr.name;

            return Promise.resolve(this);
        } catch (err) {
            // TODO: provide better parse error reporting
            //   cases:
            //     * file read error
            //     * XML parse error
            return Promise.reject(this);
        }
    }

    public get extends(): string {
        return this.xmlNode ? this.xmlNode.attr.extends : "";
    }
}

export async function getComponentDefinitionMap(rootDir: string) {
    const componentsPattern = rootDir + "/components/**/*.xml";
    const xmlFiles: string[] = fg.sync(componentsPattern, {});

    let defs = xmlFiles.map(file => new ComponentDefinition(file));
    let parsedPromises = defs.map(async def => def.parse());

    return processXmlTree(pSettle(parsedPromises));
}

async function processXmlTree(
    settledPromises: Promise<pSettle.SettledResult<ComponentDefinition>[]>
) {
    let nodeDefs = await settledPromises;
    let nodeDefMap = new Map<string, ComponentDefinition>();

    // create map of just ComponentDefinition objects
    nodeDefs.map(item => {
        if (item.isFulfilled && !item.isRejected) {
            nodeDefMap.set(item.value!.name!, item.value!);
        }
    });

    // recursively create an inheritance stack for each component def and build up
    // the component backwards from most extended component first
    let inheritanceStack: ComponentDefinition[] = [];

    nodeDefMap.forEach(nodeDef => {
        if (nodeDef && nodeDef.processed === false) {
            let xmlNode = nodeDef.xmlNode;
            inheritanceStack.push(nodeDef);
            //builds inheritance stack
            while (xmlNode && xmlNode.attr.extends) {
                let superNodeDef = nodeDefMap.get(xmlNode.attr.extends);
                if (superNodeDef) {
                    inheritanceStack.push(superNodeDef);
                    xmlNode = superNodeDef.xmlNode;
                } else {
                    xmlNode = undefined;
                }
            }

            let inheritedFields: ComponentField = {};
            // pop the stack & build our component
            // we can safely assume nodes are valid ComponentDefinition objects
            while (inheritanceStack.length > 0) {
                let newNodeDef = inheritanceStack.pop();
                if (newNodeDef) {
                    if (newNodeDef.processed) {
                        inheritedFields = newNodeDef.fields;
                    } else {
                        let nodeFields = getFields(newNodeDef.xmlNode!);
                        // we will get run-time error if any fields are duplicated
                        // between inherited components, but here we will retain
                        // the original value without throwing an error for simplicity
                        // TODO: throw exception when fields are duplicated.
                        inheritedFields = { ...nodeFields, ...inheritedFields };
                        newNodeDef.fields = inheritedFields;
                        newNodeDef.processed = true;
                    }
                }
            }
        }
    });

    nodeDefMap.forEach(nodeDef => {
        let xmlNode = nodeDef.xmlNode;
        if (xmlNode) {
            nodeDef.children = getChildren(xmlNode);
            nodeDef.scripts = getScripts(xmlNode);
            let baseNode = xmlNode.attr.extends;
            while (baseNode) {
                let baseNodeDef = nodeDefMap.get(baseNode);
                if (baseNodeDef) {
                    nodeDef.children = [...getChildren(baseNodeDef.xmlNode!), ...nodeDef.children];
                    baseNode = baseNodeDef.xmlNode!.attr.extends;
                }
            }
        }
    });

    return nodeDefMap;
}

/**
 * Returns all the fields found in the Xml node
 * @param node Xml node with fields
 * @return The fields parsed as ComponentField
 */
function getFields(node: XmlDocument): ComponentField {
    let iface = node.childNamed("interface");
    let fields: ComponentField = {};

    if (!iface) {
        return fields;
    }

    iface.eachChild(child => {
        if (child.name === "field") {
            fields[child.attr.id] = {
                type: child.attr.type,
                id: child.attr.id,
                alias: child.attr.alias,
                onChange: child.attr.onChange,
                alwaysNotify: child.attr.alwaysNotify,
                value: child.attr.value,
            };
        }
    });

    return fields;
}

/**
 * Given a node as a XmlDocument it will get all the children and return
 * them parsed.
 * @param node The XmlDocument that has the children.
 * @returns The parsed children
 */
function getChildren(node: XmlDocument): ComponentNode[] {
    let xmlElement = node.childNamed("children");

    if (!xmlElement) {
        return [];
    }

    let children: ComponentNode[] = [];
    parseChildren(xmlElement, children);

    return children;
}

/**
 * Parses children in the XmlElement converting then into an object
 * that follows the ComponentNode interface. This process makes
 * the tree creation simpler.
 * @param element The XmlElement that has the children to be parsed
 * @param children The array where parsed children will be added
 */
function parseChildren(element: XmlElement, children: ComponentNode[]): void {
    element.eachChild(child => {
        let childComponent: ComponentNode = {
            name: child.name,
            fields: child.attr,
            children: [],
        };

        if (child.children.length > 0) {
            parseChildren(child, childComponent.children);
        }

        children.push(childComponent);
    });
}

function getScripts(node: XmlDocument): ComponentScript[] {
    let scripts = node.childrenNamed("script");
    let componentScripts: ComponentScript[] = [];

    // TODO: Verify if uri is valid
    scripts.map(script => {
        if (script.attr) {
            componentScripts.push({
                type: script.attr.type,
                uri: script.attr.uri,
            });
        }
    });

    return componentScripts;
}
