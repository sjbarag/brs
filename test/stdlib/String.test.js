const { UCase, LCase, Asc, Chr } = require("../../lib/stdlib/index");
const { Interpreter } = require("../../lib/interpreter");
const { BrsString, BrsBoolean, Int32 } = require("../../lib/brsTypes");

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

    describe("Asc", () => {
        it("converts an empty BRS string to zero", () => {
            expect(
                Asc.call(interpreter, new BrsString(""))
            ).toEqual(new Int32(0));
        })
        it("converts a character to an ascii representation", () => {
            expect(
                Asc.call(interpreter, new BrsString("for"))
            ).toEqual(new Int32(102)); // ascii decimal for "f"
        })
    })

    describe("Chr", () => {
        it("converts a non-integer to an empty string", () => {
            expect(
                Chr.call(interpreter, new BrsString("some string"))
            ).toEqual(new BrsString(""));
        })

        it("converts an ascii integer to character", () => {
            expect(
                Chr.call(interpreter, new Int32(34))
            ).toEqual(new BrsString("\""));
        })
    })
})