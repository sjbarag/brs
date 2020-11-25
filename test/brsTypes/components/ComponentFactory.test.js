const brs = require("brs");
const { ComponentFactory, RoSGNode, Callable, ValueKind } = brs.types;

describe("ComponentFactory", () => {
    describe("createComponent", () => {
        it("returns a properly constructed built in Node with default name", () => {
            const component = ComponentFactory.createComponent("Rectangle");
            expect(component.nodeSubtype).toBe("Rectangle");
            expect(component.name).toBe("Rectangle");
            expect(component.constructor.name).toBe("Rectangle");
        });
        it("returns a properly constructed built in Node with custom name", () => {
            const component = ComponentFactory.createComponent("Poster", "Foo");
            expect(component.nodeSubtype).toBe("Foo");
            expect(component.constructor.name).toBe("Poster");
        });
    });

    describe("addComponentType", () => {
        class Foo extends RoSGNode {
            constructor(initializedFields = [], name = "Foo") {
                super([], name);
                this.name = name;

                this.registerDefaultFields(this.defaultFields);
                this.registerInitializedFields(initializedFields);

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

        it("adds a new Component to be constructed", () => {
            ComponentFactory.addComponentTypes([
                [
                    "Foo",
                    (name) => {
                        return new Foo([], name);
                    },
                ],
            ]);
            const component = ComponentFactory.createComponent("Foo");
            expect(component.nodeSubtype).toBe("Foo");
            expect(component.name).toBe("Foo");
            expect(component.constructor.name).toBe("Foo");
        });
    });
});
