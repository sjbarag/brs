const xmldoc = require("xmldoc");
const { componentprocessor } = require("brs");
const { getComponentDefinitions, ComponentDefinition } = require("../../lib/componentprocessor");

jest.mock("fast-glob");
jest.mock("fs");
const fg = require("fast-glob");
const fs = require("fs");

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

            let nodeDefs = await getComponentDefinitions();
            expect(nodeDefs).toEqual([]);
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
    });
});
