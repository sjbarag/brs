const { getComponentDefinitionMap, ComponentDefinition } = require("../../lib/componentprocessor");

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

        it("parses children nodes in correct order", async () => {
            const baseComp = `
<?xml version="1.0" encoding="utf-8" ?>
<component name="BaseComponent">
    <children>
        <Label name="label_a" />
    </children>
</component>
            `;
            const extendedComp = `
<?xml version="1.0" encoding="utf-8" ?>
<component name="ExtendedComponent" extends="BaseComponent">
    <children>
            <Label name="label_b" />
    </children>
</component>
            `;

            fg.sync.mockImplementation(() => {
                return ["base_component.xml", "extended_component.xml"];
            });
            fs.readFile.mockImplementation((filename, _, cb) => {
                selected = filename.includes("base_component.xml") ? baseComp : extendedComp;
                cb(/* no error */ null, selected);
            });

            let map = await getComponentDefinitionMap("/doesnt/matter");
            let parsedExtendedComp = map.get("ExtendedComponent");
            expect(parsedExtendedComp).not.toBeUndefined();
            expect(parsedExtendedComp.children).not.toBeUndefined();
            expect(parsedExtendedComp.children.length).toBeGreaterThan(0);
            let expectedChildOrder = ["label_a", "label_b"];
            let childOrder = parsedExtendedComp.children.map(child => {
                return child.fields && child.fields.name;
            });
            expect(childOrder).toEqual(expectedChildOrder);
        });
    });
});
