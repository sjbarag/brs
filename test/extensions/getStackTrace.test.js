const brs = require("../../lib");
const { Int32 } = require("../../lib/brsTypes/Int32");
const { Callable, BrsString, BrsInvalid, RoArray, RoAssociativeArray, ValueKind } = brs.types;
const { GetStackTrace } = require("../../lib/extensions/GetStackTrace");
const { Interpreter } = require("../../lib/interpreter");

describe("GetStackTrace", () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new Interpreter();
        interpreter.stack = [
            {
                file: "a/b/c.brs",
                start: {
                    line: 5,
                    column: 6,
                },
            },
            {
                file: "@external/package/utils.brs",
                start: {
                    line: 3,
                    column: 4,
                },
            },
            {
                file: "test/a/b/c.test.brs",
                start: {
                    line: 1,
                    column: 2,
                },
            },
        ];
    });

    it("returns a correctly formatted stack trace", () => {
        let result = GetStackTrace.call(interpreter);
        expect(result).toBeInstanceOf(RoArray);
        expect(result.getValue().map((line) => line.value)).toEqual([
            "test/a/b/c.test.brs:1:2",
            "@external/package/utils.brs:3:4",
            "a/b/c.brs:5:6",
        ]);
    });

    it("returns the correct number of lines when specified", () => {
        let result = GetStackTrace.call(interpreter, new Int32(1));
        expect(result.getValue().map((line) => line.value)).toEqual(["test/a/b/c.test.brs:1:2"]);
    });

    it("filters lines correctly", () => {
        let result = GetStackTrace.call(
            interpreter,
            new Int32(10),
            new RoArray([new BrsString("@external/package")])
        );
        expect(result.getValue().map((line) => line.value)).toEqual([
            "test/a/b/c.test.brs:1:2",
            "a/b/c.brs:5:6",
        ]);

        result = GetStackTrace.call(
            interpreter,
            new Int32(10),
            new RoArray([new BrsString("package")])
        );
        expect(result.getValue().map((line) => line.value)).toEqual([
            "test/a/b/c.test.brs:1:2",
            "a/b/c.brs:5:6",
        ]);
    });
});
