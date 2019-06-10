const brs = require("brs");
const { BrsString, BrsInvalid } = brs.types;
const { Run } = require("../../lib/stdlib");
const { Interpreter } = require("../../lib/interpreter");
const fs = require("fs");

jest.mock("fs");

describe("global Run function", () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new Interpreter();
    });

    afterEach(() => {
        fs.readFileSync.mockRestore();
    });

    it("returns invalid for unrecognized devices", () => {
        expect(Run.call(interpreter, new BrsString("notADevice:/etc/hosts"))).toBe(
            BrsInvalid.Instance
        );
    });

    it("returns invalid for unreadable files", () => {
        fs.readFileSync.mockImplementation(() => {
            throw new Error("file not found");
        });
        expect(Run.call(interpreter, new BrsString("notADevice:/etc/hosts"))).toBe(
            BrsInvalid.Instance
        );
    });

    it("returns invalid for lexing errors", () => {
        fs.readFileSync.mockImplementation(() => `can't lex this`);
        expect(Run.call(interpreter, new BrsString("pkg:/errors/lex.brs"))).toBe(
            BrsInvalid.Instance
        );
    });

    it("returns invalid for parse errors", () => {
        fs.readFileSync.mockImplementationOnce(() => `if return "parse error" exit while`);
        expect(Run.call(interpreter, new BrsString("pkg:/errors/parse.brs"))).toBe(
            BrsInvalid.Instance
        );
    });

    it("returns invalid for runtime errors", () => {
        fs.readFileSync.mockImplementationOnce(() => `sub main(): _ = {}: _.crash(): end sub`);
        expect(Run.call(interpreter, new BrsString("pkg:/errors/exec.brs"))).toBe(
            BrsInvalid.Instance
        );
    });

    it("returns whatever the executed file returns", () => {
        fs.readFileSync.mockImplementationOnce(
            () => `function main(): return "I'm a return value!": end function`
        );
        expect(Run.call(interpreter, new BrsString("pkg:/success/exec.brs"))).toEqual(
            new BrsString("I'm a return value!")
        );
    });
});
