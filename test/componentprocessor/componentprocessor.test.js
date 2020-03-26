const { getComponentDefinitionMap, ComponentDefinition } = require("../../lib/componentprocessor");
const path = require("path");

jest.mock("fast-glob");
jest.mock("fs");
const fg = require("fast-glob");
const fs = require("fs");

const realFs = jest.requireActual("fs");

describe.only("component parsing support", () => {
    afterEach(() => {
        fg.sync.mockRestore();
        fs.readFile.mockRestore();
    });

    describe("component processor", () => {
        it("returns an empty map if no components found", async () => {
            fg.sync.mockImplementation((pattern, options) => {
                return [];
            });

            let nodeDefs = await getComponentDefinitionMap();
            expect(nodeDefs).toEqual(new Map());
        });

        it("parses bad component definitions", async () => {
            const badDefXml = `
<?xml version="1.0" encoding="utf-8" ?>
<component name="GoodComponent" extends="BaseComponent">
</derp_component>
            `;
            fs.readFile.mockImplementation((filename, encoding, cb) =>
                cb(/* no error */ null, badDefXml)
            );

            let badDef = new ComponentDefinition("/some/valid/path.xml");
            expect(badDef.parse()).rejects.toBe(badDef);
        });

        it("parses well-defined component definition", async () => {
            const goodDefXml = `
<?xml version="1.0" encoding="utf-8" ?>
<component name="GoodComponent" extends="BaseComponent">
</component>
            `;
            fs.readFile.mockImplementation((filename, encoding, cb) =>
                cb(/* no error */ null, goodDefXml)
            );

            let goodDef = new ComponentDefinition("/some/valid/path.xml");
            let parsed = await goodDef.parse();
            let xmlNode = parsed.xmlNode;
            expect(xmlNode.name).toEqual("component");
            expect(xmlNode.attr.name).toEqual("GoodComponent");
            expect(xmlNode.attr.extends).toEqual("BaseComponent");
        });

        describe("parsing expectations", () => {
            beforeEach(() => {
                fg.sync.mockImplementation(() => {
                    return [
                        "baseComponent.xml",
                        "extendedComponent.xml",
                        "scripts/baseComp.brs",
                        "scripts/extendedComp.brs",
                        "scripts/utility.brs",
                    ];
                });
                fs.readFile.mockImplementation((filename, _, cb) => {
                    resourcePath = path.join(__dirname, "resources", filename);
                    realFs.readFile(resourcePath, (err, contents) => {
                        cb(/* no error */ null, contents);
                    });
                });
            });

            it("parses children nodes in correct order", async () => {
                let map = await getComponentDefinitionMap("/doesnt/matter");
                let parsedExtendedComp = map.get("ExtendedComponent");
                expect(parsedExtendedComp).not.toBeUndefined();
                expect(parsedExtendedComp.children).not.toBeUndefined();
                expect(parsedExtendedComp.children.length).toBeGreaterThan(0);

                let expectedChildOrder = ["label_b"];
                let childOrder = parsedExtendedComp.children.map(child => {
                    return child.fields && child.fields.name;
                });
                expect(childOrder).toEqual(expectedChildOrder);
            });

            it("adds all scripts into node in correct order", async () => {
                let map = await getComponentDefinitionMap("/doesnt/matter");
                let parsedExtendedComp = map.get("ExtendedComponent");
                expect(parsedExtendedComp).not.toBeUndefined();
                expect(parsedExtendedComp.scripts).not.toBeUndefined();
                expect(parsedExtendedComp.scripts.length).toBeGreaterThan(0);

                const expectedPrefix = "pkg:/test/componentprocessor/resources/scripts/";
                let expectedScripts = ["extendedComponent.brs", "utility.brs"].map(scriptName =>
                    path.join(expectedPrefix, scriptName).replace(/\\/g, "/")
                );
                let actualScripts = parsedExtendedComp.scripts.map(script => script.uri);
                expect(actualScripts).toEqual(expectedScripts);
            });

            it("ignores extensions of unknown node subtypes", async () => {
                fg.sync.mockImplementation(() => {
                    return ["unknownExtensionComponent.xml"];
                });

                jest.spyOn(global.console, "error").mockImplementation();
                try {
                    let map = await getComponentDefinitionMap("/doesnt/matter");
                    let invalidExtensionComponent = map.get("UnknownExtensionComponent");
                    expect(invalidExtensionComponent).toBeDefined();
                } finally {
                    global.console.error.mockRestore();
                }
            });
        });
    });
});
