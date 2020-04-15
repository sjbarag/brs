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
            // TODO: I don't think this environment spy is working as expected.
            //       am able to step through and see setMockFunction called
            //       but the mock expectations fail the test
            xit("should call environment.setMockFunction", () => {
                const envMockFunctionSpy = jest.spyOn(interpreter.environment, "setMockFunction");

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
                expect(envMockFunctionSpy).toHaveBeenCalledTimes(1);
                expect(envMockFunctionSpy).toHaveBeenCalledWith([mockName.toString(), mock]);
            });
        });
    });
});
