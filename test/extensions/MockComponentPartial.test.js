const brs = require("brs");
const { ValueKind, Callable, BrsString, Object } = brs.types;
const { Interpreter } = require("../../lib/interpreter");
const { mockComponentPartial } = require("../../lib/extensions/mockComponentPartial");

describe("mockComponentPartial", () => {
    describe("methods", () => {
        let interpreter;

        beforeEach(() => {
            interpreter = new Interpreter();
        });

        describe("calling mock functions defined in an associative array", () => {
            it("call environment.setMockFunction for each mock function defined in the associative array", () => {});
        });
    });
});
