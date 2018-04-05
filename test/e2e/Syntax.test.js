const { execute } = require("../../lib/");
const BrsError = require("../../lib/Error");

const { resourceFile, allArgs } = require("./E2ETests");

describe("end to end syntax", () => {
    let stdout;

    beforeAll(() => {
        stdout = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => stdout.mockReset());

    afterAll(() => stdout.mockRestore());

    test("comments.brs", () => {
        return execute(resourceFile("comments.brs")).then(() => {
            expect(stdout).not.toBeCalled();
        });
    });

    test("printLiterals.brs", () => {
        return execute(resourceFile("printLiterals.brs")).then(() => {
            expect(allArgs(stdout)).toEqual([
                "invalid",
                "true",
                "false",
                "5",
                "7",
                "30",
                "40",
                "hello"
            ]);
        });
    });

    test("arithmetic.brs", () => {
        return execute(resourceFile("arithmetic.brs")).then(() => {
            expect(allArgs(stdout)).toEqual([
                "3", "3", "3", "3",       // addition
                "5", "5", "5", "5",       // subtraction
                "15", "15", "15", "15",   // multiplication
                "2.5", "2", "2.5", "2.5", // division
                "8", "8", "8", "8",       // exponentiation
            ]);
        });
    });

    test("assignment.brs", () => {
        return execute(resourceFile("assignment.brs")).then(() => {
            expect(allArgs(stdout)).toEqual([
                "new value"
            ]);
        });
    });

    test("conditionals.brs", () => {
        return execute(resourceFile("conditionals.brs")).then(() => {
            expect(allArgs(stdout)).toEqual([
                "1", "2", "3", "4", "5", "6"
            ]);
        });
    });

    test("while-loops.brs", () => {
        return execute(resourceFile("while-loops.brs")).then(() => {
            expect(allArgs(stdout)).toEqual([
                "0", "1", "2", "3", "4", // count up
                "5", "4"                 // count down with exit
            ]);
        });
    });

    test("for-loops.brs", () => {
        return execute(resourceFile("for-loops.brs")).then(() => {
            expect(allArgs(stdout)).toEqual([
                "0", "2", "4", "6", // count up
                "8",                // i after loop
                "3", "2", "1", "0", // count down
                "for loop exit",    // exit early
                "0",                // e after loop
                "initial = final"   // loop where initial equals final
            ]);
        });
    });
});
