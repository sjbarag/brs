const { UCase, LCase } = require("../../lib/stdlib/index");
const { Interpreter } = require("../../lib/interpreter");
const { BrsString, BrsBoolean } = require("../../lib/brsTypes");

const interpreter = new Interpreter();

describe("global string functions", () => {
    describe("UCase", () => {
        it("converts a BRS string to its uppercase form", () => {
            const upperCase =
            expect(
                UCase.call(interpreter, new BrsString("l0rEm"))
            ).toEqual(new BrsString("L0REM"));
        });
    });

    describe("LCase", () => {
        it("converts a BRS string to its lowercase form", () => {
            const lowercase =
            expect(
                LCase.call(interpreter, new BrsString("l0rEm"))
            ).toEqual(new BrsString("l0rem"));
        });
    });
})