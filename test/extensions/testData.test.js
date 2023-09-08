const brs = require("../../lib");
const { BrsString, BrsInvalid, ValueKind } = brs.types;
const { Interpreter } = require("../../lib/interpreter");
const { identifier } = require("../parser/ParserTests");
const { resetTestData } = require("../../lib/extensions");

describe("_brs_.testData", () => {
    it("check testData object", () => {
        let _brs_ = new Interpreter().environment.get(identifier("_brs_"));
        let testData = _brs_.get(new BrsString("testData"));

        expect(testData.kind).toBe(ValueKind.Object);
        expect(testData.componentName).toBe("roAssociativeArray");
        expect(testData.elements.size).toBe(0);
        testData.set(new BrsString("foo"), BrsInvalid.Instance);
        expect(testData.elements.size).toBe(1);

        testData = new Interpreter().environment
            .get(identifier("_brs_"))
            .get(new BrsString("testData"));
        expect(testData.elements.size).toBe(1);

        resetTestData(); // will clear testData for next new Interpreter instances

        testData = new Interpreter().environment
            .get(identifier("_brs_"))
            .get(new BrsString("testData"));
        expect(testData.elements.size).toBe(0);
    });
});
