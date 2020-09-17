const brs = require("brs");
const { ValueKind, Callable, BrsString, RoSGNode, StdlibArgument } = brs.types;
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
                expect(interpreter.environment.getMockFunction("testfunction")).toBeInstanceOf(
                    Callable
                );
            });
        });

        describe("spy", () => {
            let mockName;
            let mockImpl;
            let mockSpy;
            let mockArgs;

            beforeEach(() => {
                mockName = new BrsString("testFunction");
                mockImpl = new Callable("testFunction", {
                    signature: {
                        args: [new StdlibArgument("arg", ValueKind.String)],
                        returns: ValueKind.String,
                    },
                    impl: (interpreter, arg) => {
                        return new BrsString("foo");
                    },
                });
                mockArgs = [mockName, mockImpl];
                mockFunction.getAllSignatureMismatches(mockArgs);
                mockSpy = mockFunction.call(interpreter, ...mockArgs);
            });

            it("should return a MockFunction node", () => {
                expect(mockSpy).toBeInstanceOf(RoSGNode);
            });

            it("getMockName", () => {
                let calculatedName = mockSpy.get(new BrsString("getMockName")).call(interpreter);
                expect(calculatedName.value).toEqual(mockName.value);
            });

            it("adds calls", () => {
                let mockFromInterpreter = interpreter.environment.getMockFunction("testfunction");
                mockFromInterpreter.getAllSignatureMismatches(mockArgs);
                mockFromInterpreter.call(interpreter, new BrsString("bar"));

                let calls = mockSpy.get(new BrsString("calls")).getElements();
                expect(calls.length).toEqual(1);

                let firstCallArgs = calls[0].getElements();
                expect(firstCallArgs.length).toEqual(1);
                expect(firstCallArgs[0].value).toEqual("bar");
            });

            it("adds results", () => {
                let mockFromInterpreter = interpreter.environment.getMockFunction("testfunction");
                mockFromInterpreter.getAllSignatureMismatches(mockArgs);
                mockFromInterpreter.call(interpreter, new BrsString("bar"));

                let results = mockSpy.get(new BrsString("results")).getElements();
                expect(results.length).toEqual(1);
                expect(results[0].value).toEqual("foo");
            });

            it("mockReset", () => {
                let mockFromInterpreter = interpreter.environment.getMockFunction("testfunction");
                mockFromInterpreter.getAllSignatureMismatches(mockArgs);
                mockFromInterpreter.call(interpreter, new BrsString("bar"));

                let mockReset = mockSpy.get(new BrsString("mockReset"));
                mockReset.getAllSignatureMismatches([new BrsString("mockReset")]);
                mockReset.call(interpreter);

                let results = mockSpy.get(new BrsString("results")).getElements();
                let calls = mockSpy.get(new BrsString("calls")).getElements();
                expect(results.length).toEqual(0);
                expect(calls.length).toEqual(0);
            });
        });
    });
});
