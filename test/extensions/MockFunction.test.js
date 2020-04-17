const brs = require("brs");
const { ValueKind, Callable, BrsString } = brs.types;
const { Interpreter } = require("../../lib/interpreter");
const { mockFunction } = require("../../lib/extensions/mockFunction");

describe("MockFunction", () => {
    describe("methods", () => {
        let interpreter;

        beforeEach(() => {
            interpreter = new Interpreter();
        });

        describe("calling mock function", () => {
            it("should call environment.setMockFunction", () => {
                const mockName = new BrsString("testFunction");
                const mock = new Callable("testFunction", {
                    signature: {
                        args: [],
                        returns: ValueKind.Boolean,
                    },
                    impl: () => {
                        return true;
                    },
                });
                const mockArgs = [mockName, mock];
                mockFunction.getAllSignatureMismatches(mockArgs);
                mockFunction.call(interpreter, ...mockArgs);
                expect(interpreter.environment.getMockFunction("testfunction")).toBe(mock);
            });
        });
    });
});
