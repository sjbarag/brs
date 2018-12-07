const { BrsTypes } = require("brs");
const { AssociativeArray, BrsInvalid, BrsString } = BrsTypes;
const { CreateObject } = require("../../lib/stdlib");
const { Interpreter } = require("../../lib/interpreter");

describe("global runtime functions", () => {
    describe("CreateObject", () => {
        let interpreter = new Interpreter();

        it("creates a new instance of associative array", () => {
            let obj = CreateObject.call(interpreter, new BrsString("roAssociativeArray"));
            expect(obj).toEqual(new AssociativeArray([]));
        });

        it("returns invalid for an undefined BrsObject", () => {
            let obj = CreateObject.call(interpreter, new BrsString("notAnObject"));
            expect(obj).toEqual(BrsInvalid.Instance);
        });
    });
});
