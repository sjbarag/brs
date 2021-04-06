const brs = require("brs");
const { BrsString, RoXMLElement } = brs.types;
const { Interpreter } = require("../../../lib/interpreter");

describe("RoXMLElement", () => {
    let xmlParser;
    let interpreter;

    beforeEach(() => {
        xmlParser = new RoXMLElement();
        interpreter = new Interpreter();
    });

    describe("test methods for object with successful parsed xml", () => {
        beforeEach(() => {
            let parse = xmlParser.getMethod("parse");
            parse.call(interpreter, new BrsString(getXmlString()));
        });

        it("getName", () => {
            let getName = xmlParser.getMethod("getName");
            expect(getName.call(interpreter)).toEqual(new BrsString("tag1"));
        });

        it("getNamedElementsCi", () => {
            let getNamedElementsCi = xmlParser.getMethod("getNamedElementsCi");
            expect(getNamedElementsCi.call(interpreter, new BrsString("any")).elements).toEqual([]);

            let children = getNamedElementsCi.call(interpreter, new BrsString("CHiLd1"));
            expect(children.elements.length).toEqual(2);

            let getName = children.elements[0].getMethod("getName");
            expect(getName.call(interpreter)).toEqual(new BrsString("Child1"));

            getName = children.elements[1].getMethod("getName");
            expect(getName.call(interpreter)).toEqual(new BrsString("CHILD1"));
        });

        it("getAttributes", () => {
            let getAttributes = xmlParser.getMethod("getAttributes");
            expect(getAttributes.call(interpreter).elements).not.toEqual(new Map());
            expect(getAttributes.call(interpreter).elements).toEqual(
                new Map([
                    ["id", new BrsString("someId")],
                    ["attr1", new BrsString("0")],
                ])
            );
        });
    });

    describe.each([
        ["test methods for object with no parsed xml", () => {}],
        [
            "test methods for object with failed parsing of xml",
            () => {
                let parse = xmlParser.getMethod("parse");
                parse.call(interpreter, new BrsString('>bad_tag id="12" <  some text >/bad_tag<'));
            },
        ],
    ])("%s", (name, tryParse) => {
        beforeEach(() => {
            tryParse();
        });

        it("getName", () => {
            let getName = xmlParser.getMethod("getName");
            expect(getName).toBeTruthy();
            expect(getName.call(interpreter)).toEqual(new BrsString(""));
        });

        it("getNamedElementsCi", () => {
            let getNamedElementsCi = xmlParser.getMethod("getNamedElementsCi");
            expect(getNamedElementsCi).toBeTruthy();
            expect(getNamedElementsCi.call(interpreter, new BrsString("any")).elements).toEqual([]);
        });

        it("getAttributes", () => {
            let getAttributes = xmlParser.getMethod("getAttributes");
            expect(getAttributes).toBeTruthy();
            expect(getAttributes.call(interpreter).elements).toEqual(new Map());
        });
    });

    describe("test parse method with different xml strings", () => {
        test.each([
            ["<tag>some text<tag>", true],
            ["<tag>some text <child1> child's text </child1> </tag>", true],
            [getXmlString(), true],
            ['>bad_tag id="12" <  some text >/bad_tag<', false],
            ["", false],
        ])("test parse with string %s", (xmlString, expected) => {
            let parse = xmlParser.getMethod("parse");
            expect(parse.call(interpreter, new BrsString(xmlString)).value).toBe(expected);
        });
    });
});

function getXmlString() {
    return '<tag1 id="someId" attr1="0"> <Child1 id="id1"></Child1> <CHILD1 id="id2"></CHILD1> </tag1>';
}
