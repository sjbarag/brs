const path = require("path");

const { execute } = require("../../lib/");
const BrsError = require("../../lib/Error");

/** Returns the path to a file in `resources/`. */
function resourceFile(filename) {
    return path.join(__dirname, "resources", filename);
}

function allArgs(jestMock) {
    return jestMock.mock.calls.reduce((allArgs, thisCall) => allArgs.concat(thisCall), []);
}

describe("end to end", () => {
    const stdout = jest.spyOn(console, "log");

    afterEach(() => {
        stdout.mockReset();
    });

    afterAll(() => {
        stdout.mockRestore();
    });

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
});