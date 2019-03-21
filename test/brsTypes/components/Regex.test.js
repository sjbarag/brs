const brs = require("brs");
const { BrsBoolean, BrsInvalid, BrsString, Int32, Regex, ValueKind } = brs.types;
const { Interpreter } = require("../../../lib/interpreter");

describe("Regex", () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new Interpreter;
    });

    describe("isMatch", () => {
        it("tests strings with case sensitive flag", () => {
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

        it("tests strings with case insensitive flag", () => {
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
    describe("match", () => {
        it("doesn't match string", () => {
            let rgx = new Regex(new BrsString("(a|(z))(bc)"));
            let match = rgx.getMethod("match");
            expect(match).toBeTruthy();

            let result = match.call(interpreter, new BrsString(""));
            let count = result.getMethod("count").call(interpreter);
            expect(result.kind).toBe(ValueKind.Object);
            expect(result.getComponentName()).toBe("roArray");
            expect(count.value).toBe(0);
        });

        it("matches groups in string", () => {
            let rgx = new Regex(new BrsString("(a|(z))(bc)"));
            let match = rgx.getMethod("match");
            expect(match).toBeTruthy();

            let result = match.call(interpreter, new BrsString("abcd"));
            let count = result.getMethod("count").call(interpreter);
            expect(result.kind).toBe(ValueKind.Object);
            expect(result.getComponentName()).toBe("roArray");
            expect(count.value).toBe(4);
            expect(result.get(new Int32(0)).value).toBe("abc"); //Entire match
            expect(result.get(new Int32(1)).value).toBe("a");
            expect(result.get(new Int32(2))).toEqual(BrsInvalid.Instance);
            expect(result.get(new Int32(3)).value).toBe("bc");
        });
    });
    // describe("replace");
    // describe("replaceAll");
    // describe("split");
    // describe("matchAll");
});
