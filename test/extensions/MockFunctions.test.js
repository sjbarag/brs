const brs = require("brs");
const { ValueKind, Callable, BrsString, RoAssociativeArray } = brs.types;

const { Interpreter } = require("../../lib/interpreter");
const { mockFunctions } = require("../../lib/extensions/mockFunctions");

describe("mockFunctions", () => {
    describe("methods", () => {
        let interpreter;

        beforeEach(() => {
            interpreter = new Interpreter();
        });

        describe("calling mock functions defined in an associative array", () => {
            it("call environment.setMockFunction for each mock function defined in the associative array", () => {
                const mockFns = [
                    {
                        name: new BrsString("test1"),
                        value: new Callable("testFunction1", {
                            signature: {
                                args: [],
                                returns: ValueKind.Boolean,
                            },
                            impl: () => {
                                return true;
                            },
                        }),
                    },
                    {
                        name: new BrsString("test2"),
                        value: new Callable("testFunction2", {
                            signature: {
                                args: [],
                                returns: ValueKind.Boolean,
                            },
                            impl: () => {
                                return true;
                            },
                        }),
                    },
                    {
                        name: new BrsString("test3"),
                        value: new Callable("testFunction3", {
                            signature: {
                                args: [],
                                returns: ValueKind.Boolean,
                            },
                            impl: () => {
                                return true;
                            },
                        }),
                    },
                ];
                const aa = new RoAssociativeArray(mockFns);

                mockFunctions.getAllSignatureMismatches(aa);
                mockFunctions.call(interpreter, aa);

                expect(interpreter.environment.getMockFunction("test1")).toBe(mockFns[0].value);
                expect(interpreter.environment.getMockFunction("test2")).toBe(mockFns[1].value);
                expect(interpreter.environment.getMockFunction("test3")).toBe(mockFns[2].value);
            });
        });
    });
});
