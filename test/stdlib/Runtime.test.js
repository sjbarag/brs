const brs = require("brs");
const {
    RoAssociativeArray,
    RoArray,
    BrsInterface,
    BrsInvalid,
    BrsBoolean,
    BrsString,
    Int32,
    Int64,
    Float,
    Double,
    Uninitialized,
    ValueKind,
    Callable,
    BrsComponent,
    extendBrsObjects,
} = brs.types;
const { CreateObject, Type } = require("../../lib/stdlib");
const { Interpreter } = require("../../lib/interpreter");

describe("global runtime functions", () => {
    let interpreter = new Interpreter();

    describe("CreateObject", () => {
        it("creates a new instance of associative array", () => {
            let obj = CreateObject.call(interpreter, new BrsString("roAssociativeArray"));
            expect(obj.elements).toEqual(new Map());
        });

        it("returns invalid for an undefined BrsObject", () => {
            let obj = CreateObject.call(interpreter, new BrsString("notAnObject"));
            expect(obj).toEqual(BrsInvalid.Instance);
        });

        describe("extendBrsObjects", () => {
            class HelloWorld extends BrsComponent {
                constructor() {
                    super("HelloWorld");

                    this.sayHello = new Callable("sayHello", {
                        signature: {
                            args: [],
                            returns: ValueKind.String,
                        },
                        impl: (_interpreter) => {
                            return "Hello world";
                        },
                    });

                    this.registerMethods({
                        ifHelloWorld: [this.sayHello],
                    });
                }
            }

            it("can return a new object defined at run time", () => {
                extendBrsObjects([["HelloWorld", (_interpreter) => new HelloWorld()]]);
                let obj = CreateObject.call(interpreter, new BrsString("HelloWorld"));
                expect(obj.sayHello.call(interpreter)).toEqual("Hello world");
            });
        });
    });

    describe("Type", () => {
        describe("version 3", () => {
            [
                { value: new BrsInterface("ifArray", []), type: "ifArray" },
                { value: BrsInvalid.Instance, type: "Invalid" },
                { value: BrsBoolean.False, type: "Boolean" },
                { value: new BrsString("foo"), type: "String" },
                { value: new Int32(5), type: "Integer" },
                { value: new Int64(55), type: "LongInteger" },
                { value: new Float(1.23), type: "Float" },
                { value: new Double(1.001), type: "Double" },
                { value: CreateObject, type: "Function" },
                { value: new RoArray([]), type: "roArray" },
                { value: new RoAssociativeArray([]), type: "roAssociativeArray" },
                { value: Uninitialized.Instance, type: "<uninitialized>" },
            ].forEach((testCase) =>
                test(testCase.type, () => {
                    expect(Type.call(interpreter, testCase.value, new Int32(3))).toEqual(
                        new BrsString(testCase.type)
                    );
                })
            );
        });

        describe("not version 3", () => {
            [
                { value: new BrsInterface("ifArray", []), type: "ifArray" },
                { value: BrsInvalid.Instance, type: "Invalid" },
                { value: BrsBoolean.False, type: "Boolean" },
                { value: new BrsString("foo"), type: "String" },
                { value: new Int32(5), type: "Integer" },
                { value: new Int64(55), type: "LongInteger" },
                { value: new Float(1.23), type: "Float" },
                { value: new Double(1.001), type: "Double" },
                { value: CreateObject, type: "Function" },
                { value: new RoArray([]), type: "roArray" },
                { value: new RoAssociativeArray([]), type: "roAssociativeArray" },
                { value: Uninitialized.Instance, type: "<uninitialized>" },
            ].forEach((testCase) =>
                test(testCase.type, () => {
                    expect(Type.call(interpreter, testCase.value)).toEqual(
                        new BrsString(testCase.type)
                    );
                })
            );
        });
    });
});
