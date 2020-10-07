const brs = require("brs");
const { ValueKind, Callable, BrsString, RoAssociativeArray } = brs.types;

const { ComponentDefinition } = require("../../lib/componentprocessor");

const { Interpreter } = require("../../lib/interpreter");
const { mockComponentPartial } = require("../../lib/extensions/mockComponentPartial");
const { BrsInvalid } = require("../../lib/brsTypes/BrsType");

describe("mockComponentPartial", () => {
    let interpreter;

    beforeEach(() => {
        interpreter = new Interpreter();
    });

    describe("calling mock functions defined in an associative array", () => {
        it("call environment.setMockFunction for each mock function defined in the associative array", () => {
            const mockName = new BrsString("IAmAComponent");
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
            const mockArgs = [mockName, aa];

            let component = new ComponentDefinition("/some/path/to/IAmAComponent.xml");
            let anotherComponent = new ComponentDefinition("/another/path/to/AnotherComponent.xml");

            interpreter.environment.nodeDefMap.set(mockName.value.toLowerCase(), component);
            component.environment = interpreter.environment.createSubEnvironment(false);
            anotherComponent.environment = interpreter.environment.createSubEnvironment(false);

            mockComponentPartial.getAllSignatureMismatches(mockArgs);
            mockComponentPartial.call(interpreter, ...mockArgs);

            let maybeComponent = interpreter.environment.nodeDefMap.get(
                mockName.value.toLowerCase()
            );

            expect(maybeComponent.environment.getMockFunction("test1")).toBe(mockFns[0].value);
            expect(maybeComponent.environment.getMockFunction("test2")).toBe(mockFns[1].value);
            expect(maybeComponent.environment.getMockFunction("test3")).toBe(mockFns[2].value);

            /** We expect anotherComponent to return BrsInvalid when attempting to access the same mock functions */
            /** This validates only the component subtype that declares the mock functions should be the one receiving them  */
            let anotherComponent1 = anotherComponent.environment.getMockFunction("test1");
            let anotherComponent2 = anotherComponent.environment.getMockFunction("test2");
            let anotherComponent3 = anotherComponent.environment.getMockFunction("test3");
            expect(anotherComponent1.kind).toEqual(1);
            expect(anotherComponent2.kind).toEqual(1);
            expect(anotherComponent3.kind).toEqual(1);
        });
    });
});
