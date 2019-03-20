const brs = require("brs");
const { BrsBoolean, BrsString, Regex, ValueKind } = brs.types;
const { Interpreter } = require("../../../lib/interpreter");

describe("Regex", () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new Interpreter;
    });

    describe("isMatch", () => {
        it("tests strings case sensitive", () => {
            let regx = new Regex(new BrsString("hello_[0-9]*_world"));
            let isMatch = regx.getMethod("isMatch");
            expect(isMatch).toBeTruthy();

            let str1 = isMatch.call(interpreter, new BrsString("hello_123_world"));
            expect(str1.kind).toBe(ValueKind.Boolean);
            expect(str1).toBe(BrsBoolean.True);

            let str2 = isMatch.call(interpreter, new BrsString("HeLlO_123_WoRlD"));
            expect(str2.kind).toBe(ValueKind.Boolean);
            expect(str2).toBe(BrsBoolean.False);
        });

        it("tests strings case insensitive", () => {
            let regx = new Regex(new BrsString("hello_[0-9]*_world"), new BrsString("i"));
            let isMatch = regx.getMethod("isMatch");
            expect(isMatch).toBeTruthy();

            let str1 = isMatch.call(interpreter, new BrsString("HeLlO_123_WoRlD"));
            expect(str1.kind).toBe(ValueKind.Boolean);
            expect(str1).toBe(BrsBoolean.True);

            let str2 = isMatch.call(interpreter, new BrsString("HeLlO_XXX_WoRlD"));
            expect(str2.kind).toBe(ValueKind.Boolean);
            expect(str2).toBe(BrsBoolean.False);
        });
    });
    // describe("match");
    // describe("replace");
    // describe("replaceAll");
    // describe("split");
    // describe("matchAll");
});