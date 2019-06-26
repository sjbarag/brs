import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import xmldoc, { XmlDocument } from "xmldoc";
import pSettle = require("p-settle");
const readFile = promisify(fs.readFile);
import * as fg from "fast-glob";

export class ComponentDefinition {
    public contents?: string;
    public xmlNode?: XmlDocument;
    public name?: string;

    constructor(readonly xmlPath: string) {}

    async parse(): Promise<ComponentDefinition> {
        let contents;
        try {
            contents = await readFile(this.xmlPath, "utf-8");
            let xmlStr = contents.toString().replace(/\r?\n|\r/g, "");
            this.xmlNode = new xmldoc.XmlDocument(xmlStr);
            this.name = this.xmlNode.attr.name;

            return Promise.resolve(this);
        } catch (err) {
            console.log("some error");
            console.log(err);
            // TODO: provide better parse error reporting
            //   cases:
            //     * file read error
            //     * XML parse error
            return Promise.reject(this);
        }
    }
}

export async function getComponentDefinitions(rootDir: string) {
    const componentsPattern = rootDir + "/components/**/*.xml";
    const xmlFiles: string[] = fg.sync(componentsPattern, {});

    let defs = xmlFiles.map(file => new ComponentDefinition(file));
    let parsedPromises = defs.map(async def => def.parse());

    return pSettle(parsedPromises);
}
