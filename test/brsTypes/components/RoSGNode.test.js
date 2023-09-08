const brs = require("../../../lib");
const {
    RoAssociativeArray,
    RoSGNode,
    RoArray,
    BrsBoolean,
    BrsString,
    Int32,
    Int64,
    Float,
    Double,
    BrsInvalid,
    ValueKind,
    Uninitialized,
    Callable,
    MarkupGrid,
} = brs.types;
const { Interpreter } = require("../../../lib/interpreter");
const { Scope } = require("../../../lib/interpreter/Environment");

describe("RoSGNode", () => {
    describe("stringification", () => {
        it("lists all primitive values", () => {
            let node = new RoSGNode([
                {
                    name: new BrsString("array"),
                    value: new RoArray([new BrsString("I shouldn't appear")]),
                },
                { name: new BrsString("associative-array"), value: new RoAssociativeArray([]) },
                { name: new BrsString("node"), value: new RoSGNode([]) },
                { name: new BrsString("boolean"), value: BrsBoolean.True },
                { name: new BrsString("string"), value: new BrsString("a string") },
                { name: new BrsString("number"), value: new Int32(-1) },
            ]);
            expect(node.toString()).toEqual(
                `<Component: roSGNode:Node> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: ""
    array: <Component: roArray>
    associative-array: <Component: roAssociativeArray>
    node: <Component: roSGNode:Node>
    boolean: true
    string: "a string"
    number: -1
}`
            );
        });
    });

    describe("get", () => {
        it("returns value given a key it contains", () => {
            let node = new RoSGNode([{ name: new BrsString("foo"), value: new Int32(-99) }]);

            expect(node.get(new BrsString("foo"))).toEqual(new Int32(-99));
        });

        it("returns 'invalid' given a key it doesn't contain", () => {
            let node = new RoSGNode([]);

            expect(node.get(new BrsString("does_not_exist"))).toEqual(BrsInvalid.Instance);
        });
    });

    describe("set", () => {
        it("sets values with new keys", () => {
            let node = new RoSGNode([{ name: new BrsString("foo"), value: new Int32(-99) }]);
            let ninetyNine = node.get(new BrsString("foo"));

            node.set(new BrsString("bar"), new Int32(808));
            expect(node.get(new BrsString("bar"))).toEqual(new Int32(808));

            // ensure other keys don't get modified
            expect(node.get(new BrsString("foo"))).toBe(ninetyNine);
        });

        it("overwrites values with existing keys if they are the same type", () => {
            let node = new RoSGNode([{ name: new BrsString("foo"), value: new Int32(-99) }]);

            node.set(new BrsString("foo"), new Int32(66));

            expect(node.get(new BrsString("foo"))).toEqual(new Int32(66));
        });

        it("converts types on number fields", () => {
            let node = new RoSGNode([
                {
                    name: new BrsString("intFoo"),
                    value: new Int32(99),
                },
                {
                    name: new BrsString("longBar"),
                    value: new Int64(4321),
                },
                {
                    name: new BrsString("floatBat"),
                    value: new Float(33.7),
                },
                {
                    name: new BrsString("doubleTrouble"),
                    value: new Double(33.7),
                },
            ]);

            node.set(new BrsString("intFoo"), new Float(34.3));
            expect(node.get(new BrsString("intFoo"))).toEqual(new Int32(34));

            node.set(new BrsString("intFoo"), new Double(38.7));
            expect(node.get(new BrsString("intFoo"))).toEqual(new Int32(38));

            node.set(new BrsString("longBar"), new Float(34.3));
            expect(node.get(new BrsString("longBar"))).toEqual(new Int64(34));

            node.set(new BrsString("longBar"), new Double(38.7));
            expect(node.get(new BrsString("longBar"))).toEqual(new Int64(38));

            node.set(new BrsString("floatBat"), new Int32(38));
            expect(node.get(new BrsString("floatBat"))).toEqual(new Float(38));

            node.set(new BrsString("floatBat"), new Double(31.7));
            expect(node.get(new BrsString("floatBat"))).toEqual(new Float(31.7));

            node.set(new BrsString("doubleTrouble"), new Int32(49));
            expect(node.get(new BrsString("doubleTrouble"))).toEqual(new Double(49));

            node.set(new BrsString("doubleTrouble"), new Float(11.2));
            expect(node.get(new BrsString("doubleTrouble"))).toEqual(new Double(11.2));
        });
    });

    describe("methods", () => {
        let interpreter;

        beforeEach(() => {
            interpreter = new Interpreter();
        });

        describe("clear", () => {
            it("empties the associative array", () => {
                let node = new RoSGNode([{ name: new BrsString("foo"), value: new Int32(-99) }]);

                let clear = node.getMethod("clear");
                expect(clear).toBeTruthy();
                expect(clear.call(interpreter)).toBe(BrsInvalid.Instance);
                expect(node.getFields()).toEqual(new Map());
            });
        });

        describe("delete", () => {
            it("deletes a given item in the associative array", () => {
                let node = new RoSGNode([
                    { name: new BrsString("foo"), value: new Int32(-99) },
                    { name: new BrsString("bar"), value: new Int32(800) },
                ]);

                let deleteCall = node.getMethod("delete");
                expect(deleteCall).toBeTruthy();
                expect(deleteCall.call(interpreter, new BrsString("foo"))).toBe(BrsBoolean.True);
                expect(deleteCall.call(interpreter, new BrsString("baz"))).toBe(BrsBoolean.True);
                expect(node.get(new BrsString("foo"))).toEqual(BrsInvalid.Instance);
            });

            it("deletes a given item in the associative array, ignoring case", () => {
                let node = new RoSGNode([{ name: new BrsString("foo"), value: new Int32(-99) }]);

                let deleteCall = node.getMethod("delete");
                expect(deleteCall).toBeTruthy();
                expect(deleteCall.call(interpreter, new BrsString("Foo"))).toBe(BrsBoolean.True);
                expect(deleteCall.call(interpreter, new BrsString("baz"))).toBe(BrsBoolean.True);
                expect(node.get(new BrsString("foo"))).toEqual(BrsInvalid.Instance);
            });
        });

        describe("addreplace", () => {
            it("adds new elements to the associative array", () => {
                let node = new RoSGNode([
                    { name: new BrsString("letter1"), value: new BrsString("a") },
                ]);

                let addreplace = node.getMethod("addreplace");
                expect(addreplace).toBeTruthy();
                expect(
                    addreplace.call(interpreter, new BrsString("letter2"), new BrsString("b"))
                ).toBe(BrsInvalid.Instance);
                expect(node.get(new BrsString("letter2"))).toEqual(new BrsString("b"));
            });

            it("replaces the value of known elements in the associative array", () => {
                let node = new RoSGNode([
                    { name: new BrsString("letter1"), value: new BrsString("a") },
                ]);

                let addreplace = node.getMethod("addreplace");
                expect(addreplace).toBeTruthy();
                expect(
                    addreplace.call(interpreter, new BrsString("letter1"), new BrsString("c"))
                ).toBe(BrsInvalid.Instance);
                expect(node.get(new BrsString("letter1"))).not.toEqual(new BrsString("a"));
                expect(node.get(new BrsString("letter1"))).toEqual(new BrsString("c"));
            });
        });

        describe("count", () => {
            it("returns the number of items in the associative array", () => {
                let node = new RoSGNode([
                    { name: new BrsString("letter1"), value: new BrsString("a") },
                    { name: new BrsString("letter2"), value: new BrsString("b") },
                ]);

                let count = node.getMethod("count");
                expect(count).toBeTruthy();

                let result = count.call(interpreter);
                expect(result).toEqual(new Int32(6));
            });
        });

        describe("doesexist", () => {
            it("returns true when an item exists in the array", () => {
                let node = new RoSGNode([
                    { name: new BrsString("letter1"), value: new BrsString("a") },
                    { name: new BrsString("letter2"), value: new BrsString("b") },
                ]);

                let doesexist = node.getMethod("doesexist");
                expect(doesexist).toBeTruthy();

                let result = doesexist.call(interpreter, new BrsString("letter2"));
                expect(result.kind).toBe(ValueKind.Boolean);
                expect(result).toBe(BrsBoolean.True);
            });

            it("returns false when an item doesn't exist in the array", () => {
                let node = new RoSGNode([
                    { name: new BrsString("letter1"), value: new BrsString("a") },
                    { name: new BrsString("letter2"), value: new BrsString("b") },
                ]);

                let doesexist = node.getMethod("doesexist");
                let result = doesexist.call(interpreter, new BrsString("letter3"));
                expect(result.kind).toBe(ValueKind.Boolean);
                expect(result).toBe(BrsBoolean.False);
            });
        });

        describe("append", () => {
            it("appends a new associative array to an existing one", () => {
                let node1 = new RoSGNode([
                    { name: new BrsString("letter1"), value: new BrsString("a") },
                ]);

                let append = node1.getMethod("append");
                expect(append).toBeTruthy();

                let node2 = new RoSGNode([
                    { name: new BrsString("letter2"), value: new BrsString("b") },
                    { name: new BrsString("empty"), value: new BrsString("") },
                    {
                        name: new BrsString("arr"),
                        value: new RoArray([new Int32(1), new BrsString("two")]),
                    },
                    { name: new BrsString("obj"), value: new RoSGNode([]) },
                    { name: new BrsString("num"), value: new Int32(555) },
                ]);

                let resultNode = new RoSGNode([
                    { name: new BrsString("letter1"), value: new BrsString("a") },
                    { name: new BrsString("letter2"), value: new BrsString("b") },
                    { name: new BrsString("empty"), value: new BrsString("") },
                    {
                        name: new BrsString("arr"),
                        value: new RoArray([new Int32(1), new BrsString("two")]),
                    },
                    { name: new BrsString("obj"), value: new RoSGNode([]) },
                    { name: new BrsString("num"), value: new Int32(555) },
                ]);

                let result = append.call(interpreter, node2);
                expect(node1.toString()).toEqual(resultNode.toString());
                expect(result).toBe(BrsInvalid.Instance);
            });
        });

        describe("keys", () => {
            it("returns an array of keys from the associative array in lexicographical order", () => {
                let change = new BrsString("change");
                let focusable = new BrsString("focusable");
                let focusedChild = new BrsString("focusedchild");
                let id = new BrsString("id");
                let letter1 = new BrsString("letter1");
                let letter2 = new BrsString("letter2");
                let cletter = new BrsString("cletter");

                let node = new RoSGNode([
                    { name: letter1, value: new BrsString("a") },
                    { name: letter2, value: new BrsString("b") },
                    { name: cletter, value: new BrsString("c") },
                ]);

                let keys = node.getMethod("keys");
                expect(keys).toBeTruthy();

                let result = keys.call(interpreter);
                expect(result.getElements()).toEqual([
                    change,
                    cletter,
                    focusable,
                    focusedChild,
                    id,
                    letter1,
                    letter2,
                ]);
            });

            it("returns an empty array from an empty associative array", () => {
                let change = new BrsString("change");
                let focusable = new BrsString("focusable");
                let focusedChild = new BrsString("focusedchild");
                let id = new BrsString("id");

                let node = new RoSGNode([]);

                let keys = node.getMethod("keys");
                expect(keys).toBeTruthy();

                let result = keys.call(interpreter);
                expect(result.getElements()).toEqual([change, focusable, focusedChild, id]);
            });
        });

        describe("items", () => {
            it("returns an array of key-value pairs from the associative array in lexicographical order", () => {
                let focusable = BrsBoolean.False;
                let focusedChild = BrsInvalid.Instance;
                let id = new BrsString("");
                let cletter = new BrsString("c");
                let letter1 = new BrsString("a");
                let letter2 = new BrsString("b");

                let node = new RoSGNode([
                    { name: new BrsString("cletter"), value: cletter },
                    { name: new BrsString("letter1"), value: letter1 },
                    { name: new BrsString("letter2"), value: letter2 },
                ]);
                let change = node.getFields().get("change").getValue();

                let items = node.getMethod("items");
                expect(items).toBeTruthy();

                let result = items.call(interpreter);
                let keyValPairs = result.getElements();
                let expectedValues = [
                    change,
                    cletter,
                    focusable,
                    focusedChild,
                    id,
                    letter1,
                    letter2,
                ];

                expect(keyValPairs.length).toEqual(expectedValues.length);
                expectedValues.forEach((expectedValue, index) => {
                    let actualValue = keyValPairs[index].get(new BrsString("value"));
                    expect(actualValue).toEqual(expectedValue);
                });
            });

            it("returns an empty array from an empty associative array", () => {
                let focusable = BrsBoolean.False;
                let focusedChild = BrsInvalid.Instance;
                let id = new BrsString("");

                let node = new RoSGNode([]);
                let change = node.getFields().get("change").getValue();

                let items = node.getMethod("items");
                expect(items).toBeTruthy();

                let result = items.call(interpreter);
                let keyValPairs = result.getElements();
                let expectedValues = [change, focusable, focusedChild, id];

                expect(keyValPairs.length).toEqual(expectedValues.length);
                expectedValues.forEach((expectedValue, index) => {
                    let actualValue = keyValPairs[index].get(new BrsString("value"));
                    expect(actualValue).toEqual(expectedValue);
                });
            });
        });
    });

    describe("ifSGNodeField", () => {
        let interpreter;

        beforeEach(() => {
            interpreter = new Interpreter();
        });

        describe("addfield", () => {
            it("adds a field to the object", () => {
                let node = new RoSGNode([]);

                let addField = node.getMethod("addfield");
                expect(addField).toBeTruthy();

                let result = addField.call(
                    interpreter,
                    new BrsString("field1"),
                    new BrsString("string"),
                    BrsBoolean.True
                );
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(5);
            });

            it("doesn't add the field if the type is not valid", () => {
                let node = new RoSGNode([]);

                let addField = node.getMethod("addfield");

                let result = addField.call(
                    interpreter,
                    new BrsString("field1"),
                    new BrsString("not-valid-type"),
                    BrsBoolean.True
                );
                expect(result).toEqual(BrsBoolean.True); //Brightscript interpreter returns true here
                expect(node.getFields().size).toEqual(4);
            });
        });

        describe("addfields", () => {
            it("adds multiple fields to the node", () => {
                let node = new RoSGNode([]);
                let fields = new RoAssociativeArray([
                    { name: new BrsString("associative-array"), value: new RoAssociativeArray([]) },
                    { name: new BrsString("node"), value: new RoSGNode([]) },
                    { name: new BrsString("boolean"), value: BrsBoolean.True },
                    { name: new BrsString("string"), value: new BrsString("a string") },
                    { name: new BrsString("number"), value: new Int32(-1) },
                    // should not add an invalid field
                    { name: new BrsString("invalid"), value: BrsInvalid.Instance },
                ]);

                let addFields = node.getMethod("addfields");
                expect(addFields).toBeTruthy();

                let result = addFields.call(interpreter, fields);
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(9);
            });

            it("doesn't add duplicated fields", () => {
                let node = new RoSGNode([]);
                let fields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString("a string") },
                    { name: new BrsString("field2"), value: new Int32(-1) },
                ]);

                let addFields = node.getMethod("addfields");
                let result = addFields.call(interpreter, fields);
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(6);

                let moreFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString("my string") },
                    { name: new BrsString("field2"), value: new Int32(-10) },
                    // should not add an invalid field
                    { name: new BrsString("field3"), value: BrsInvalid.Instance },
                ]);
                result = addFields.call(interpreter, moreFields);
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(6); //Only adds the non duplicated
            });

            it("only adds fields if passed as an associative array", () => {
                let node = new RoSGNode([]);
                let fields = new BrsString("non associative array");

                let addFields = node.getMethod("addfields");

                let result = addFields.call(interpreter, fields);
                expect(result).toEqual(BrsBoolean.False);
                expect(node.getFields().size).toEqual(4);
            });
        });

        describe("getfield", () => {
            it("gets an non-existing field from node", () => {
                let node = new RoSGNode([]);

                let getField = node.getMethod("getfield");
                expect(getField).toBeTruthy();

                let result = getField.call(interpreter, new BrsString("field1"));
                expect(result).toEqual(BrsInvalid.Instance);
            });

            it("gets the value of a defined field", () => {
                let node = new RoSGNode([]);

                let addField = node.getMethod("addfield");
                addField.call(
                    interpreter,
                    new BrsString("field1"),
                    new BrsString("string"),
                    BrsBoolean.True
                );

                let getField = node.getMethod("getfield");
                let result = getField.call(interpreter, new BrsString("field1"));
                expect(result).toEqual(new BrsString(""));
                expect(node.get(new BrsString("field1"))).toEqual(new BrsString(""));
            });
        });

        describe("getFields", () => {
            it("returns all visible fields", () => {
                let node = new RoSGNode([]);

                let getFields = node.getMethod("getfields");
                expect(getFields).toBeTruthy();

                let result = getFields.call(interpreter);
                let expected = new RoAssociativeArray([
                    { name: new BrsString("change"), value: new RoAssociativeArray([]) },
                    { name: new BrsString("focusable"), value: BrsBoolean.False },
                    { name: new BrsString("focusedchild"), value: BrsInvalid.Instance },
                    { name: new BrsString("id"), value: new BrsString("") },
                ]);
                result.elements.forEach((value, name) => {
                    if (value instanceof RoAssociativeArray) {
                        expect(value.elements).toBeInstanceOf(Map);
                        expect(value.elements).toEqual(expected.elements.get(name).elements);
                    } else {
                        expect(value).toEqual(expected.elements.get(name));
                    }
                });
            });
        });

        describe("hasfield", () => {
            it("returns presence of a field", () => {
                let node = new RoSGNode([{ name: new BrsString("foo"), value: new Int32(17) }]);

                let hasField = node.getMethod("hasfield");
                let result1 = hasField.call(interpreter, new BrsString("foo"));
                expect(result1).toEqual(new BrsBoolean(true));

                let result2 = hasField.call(interpreter, new BrsString("bar"));
                expect(result2).toEqual(new BrsBoolean(false));
            });
        });

        describe("observefield", () => {
            it("adds an observer", () => {
                let cbImpl = jest.fn();
                let node = new RoSGNode([
                    { name: new BrsString("foo"), value: new Int32(-99) },
                    { name: new BrsString("bar"), value: new BrsString("hello") },
                ]);

                interpreter.environment.hostNode = node;
                interpreter.environment.define(
                    Scope.Module,
                    "callback",
                    new Callable("callback", {
                        signature: {
                            args: [],
                            returns: ValueKind.Void,
                        },
                        impl: cbImpl,
                    })
                );

                let observeField = node.getMethod("observefield");
                expect(observeField).toBeTruthy();

                observeField.call(interpreter, new BrsString("foo"), new BrsString("callback"));

                node.set(new BrsString("foo"), new Int32(1));
                expect(cbImpl).toHaveBeenCalledTimes(1);
            });
        });

        describe("unobserveField", () => {
            it("removes all non-permanent observers", () => {
                let cbImpl = jest.fn();
                let target = new RoSGNode([
                    { name: new BrsString("foo"), value: new Int32(-99) },
                    { name: new BrsString("bar"), value: new BrsString("hello") },
                ]);

                let subscriberA = new RoSGNode([]);
                let subscriberB = new RoSGNode([]);

                [subscriberA, subscriberB].forEach((subscriber) => {
                    interpreter.environment.hostNode = subscriber;
                    interpreter.environment.define(
                        Scope.Module,
                        "callback",
                        new Callable("callback", {
                            signature: {
                                args: [],
                                returns: ValueKind.Void,
                            },
                            impl: cbImpl,
                        })
                    );

                    // observe the field from each subscriber
                    let observeField = target.getMethod("observefield");
                    expect(observeField).toBeTruthy();
                    observeField.call(interpreter, new BrsString("foo"), new BrsString("callback"));
                });

                // update the field to trigger both subscribers
                target.set(new BrsString("foo"), new Int32(1));
                expect(cbImpl).toHaveBeenCalledTimes(2);

                // now remove the observer
                let unobserveField = target.getMethod("unobserveField");
                expect(unobserveField).toBeTruthy();
                unobserveField.call(interpreter, new BrsString("foo"));

                // and make sure neither subscriber is called
                target.set(new BrsString("foo"), new Int32(-99));
                expect(cbImpl).toHaveBeenCalledTimes(2);
            });
        });

        describe("observeFieldScoped", () => {
            it("adds an observer", () => {
                let cbImpl = jest.fn();
                let node = new RoSGNode([
                    { name: new BrsString("foo"), value: new Int32(-99) },
                    { name: new BrsString("bar"), value: new BrsString("hello") },
                ]);

                interpreter.environment.hostNode = node;
                interpreter.environment.define(
                    Scope.Module,
                    "callback",
                    new Callable("callback", {
                        signature: {
                            args: [],
                            returns: ValueKind.Void,
                        },
                        impl: cbImpl,
                    })
                );

                let observeFieldScoped = node.getMethod("observefieldscoped");
                expect(observeFieldScoped).toBeTruthy();

                observeFieldScoped.call(
                    interpreter,
                    new BrsString("foo"),
                    new BrsString("callback")
                );

                node.set(new BrsString("foo"), new Int32(1));
                expect(cbImpl).toHaveBeenCalledTimes(1);
            });
        });

        describe("unobserveFieldScoped", () => {
            it("removes all subscribers of calling node", () => {
                let target = new RoSGNode([
                    { name: new BrsString("foo"), value: new Int32(-99) },
                    { name: new BrsString("bar"), value: new BrsString("hello") },
                ]);

                let subscriberA = new RoSGNode([]);
                let callbackA = jest.fn();
                let subscriberB = new RoSGNode([]);
                let callbackB = jest.fn();

                [
                    [subscriberA, callbackA],
                    [subscriberB, callbackB],
                ].forEach(([subscriber, cbImpl]) => {
                    interpreter.environment.hostNode = subscriber;
                    interpreter.environment.define(
                        Scope.Module,
                        "callback",
                        new Callable("callback", {
                            signature: {
                                args: [],
                                returns: ValueKind.Void,
                            },
                            impl: cbImpl,
                        })
                    );

                    // observe the field from each subscriber
                    let observeField = target.getMethod("observefieldScoped");
                    expect(observeField).toBeTruthy();
                    observeField.call(interpreter, new BrsString("foo"), new BrsString("callback"));
                });

                // update the field to trigger both subscribers
                target.set(new BrsString("foo"), new Int32(1));
                expect(callbackA).toHaveBeenCalledTimes(1);
                expect(callbackB).toHaveBeenCalledTimes(1);

                // now remove observer B (since subscriberB is still the host node)
                let unobserveFieldScoped = target.getMethod("unobserveFieldScoped");
                expect(unobserveFieldScoped).toBeTruthy();
                unobserveFieldScoped.call(interpreter, new BrsString("foo"));

                // and make sure B is only called once
                target.set(new BrsString("foo"), new Int32(-99));
                expect(callbackA).toHaveBeenCalledTimes(2);
                expect(callbackB).toHaveBeenCalledTimes(1);
            });
        });

        describe("removefield", () => {
            it("removes a field from the node", () => {
                let node = new RoSGNode([]);

                let addField = node.getMethod("addfield");
                let removeField = node.getMethod("removefield");
                expect(removeField).toBeTruthy();

                let result = addField.call(
                    interpreter,
                    new BrsString("field1"),
                    new BrsString("string"),
                    BrsBoolean.False
                );
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(5);

                result = removeField.call(interpreter, new BrsString("field1"));
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(4);
            });

            it("removes a field from the node, ignoring case", () => {
                let node = new RoSGNode([]);

                let addField = node.getMethod("addfield");
                let removeField = node.getMethod("removefield");
                expect(removeField).toBeTruthy();

                let result = addField.call(
                    interpreter,
                    new BrsString("field1"),
                    new BrsString("string"),
                    BrsBoolean.False
                );
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(5);

                result = removeField.call(interpreter, new BrsString("Field1"));
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(4);
            });

            it("doesn't remove a non existing field", () => {
                let node = new RoSGNode([]);

                let addField = node.getMethod("addfield");
                let removeField = node.getMethod("removefield");

                let result = addField.call(
                    interpreter,
                    new BrsString("field1"),
                    new BrsString("string"),
                    BrsBoolean.False
                );
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(5);

                result = removeField.call(interpreter, new BrsString("field2"));
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(5);
            });

            it("removes a field defined as invalid", () => {
                let node = new RoSGNode([
                    { name: new BrsString("useless"), value: BrsInvalid.Instance },
                ]);

                let removeField = node.getMethod("removefield");

                result = removeField.call(interpreter, new BrsString("useless"));
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(4);
            });
        });

        describe("setfield", () => {
            it("updates the value of an existing field", () => {
                let node = new RoSGNode([]);
                const strVal = "value updated";

                let addField = node.getMethod("addfield");
                let setField = node.getMethod("setfield");
                let getField = node.getMethod("getfield");
                expect(setField).toBeTruthy();

                let result = addField.call(
                    interpreter,
                    new BrsString("field1"),
                    new BrsString("string"),
                    BrsBoolean.False
                );
                expect(result).toEqual(BrsBoolean.True);
                result = setField.call(interpreter, new BrsString("field1"), new BrsString(strVal));
                expect(result).toEqual(BrsBoolean.True);
                result = getField.call(interpreter, new BrsString("field1"));
                expect(result.value).toEqual(strVal);
            });

            it("doesn't update the value of a field if not the same type", () => {
                let node = new RoSGNode([]);

                let addField = node.getMethod("addfield");
                let setField = node.getMethod("setfield");

                let result = addField.call(
                    interpreter,
                    new BrsString("field1"),
                    new BrsString("integer"),
                    BrsBoolean.False
                );
                expect(result).toEqual(BrsBoolean.True);
                result = setField.call(
                    interpreter,
                    new BrsString("field1"),
                    new BrsString("new value")
                );
                expect(result).toEqual(BrsBoolean.False);
            });

            it("doesn't update the value of a non existing field", () => {
                let node = new RoSGNode([]);

                let setField = node.getMethod("setfield");
                let result = setField.call(interpreter, new BrsString("field1"), new Int32(999));
                expect(result).toEqual(BrsBoolean.False);
                expect(node.getFields().size).toEqual(4);
            });
        });

        describe("setfields", () => {
            it("updates the value of existing fields", () => {
                let node = new RoSGNode([]);
                const strVal = "updated string";
                const intVal = 666;
                let initialFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString("a string") },
                    { name: new BrsString("field2"), value: new Int32(-1) },
                    { name: new BrsString("field3"), value: BrsBoolean.False },
                ]);

                let addFields = node.getMethod("addfields");
                let setFields = node.getMethod("setfields");
                let getField = node.getMethod("getfield");
                expect(setFields).toBeTruthy();

                let result = addFields.call(interpreter, initialFields);
                expect(result).toEqual(BrsBoolean.True);

                let updatedFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString(strVal) },
                    { name: new BrsString("field2"), value: new Int32(intVal) },
                ]);

                result = setFields.call(interpreter, updatedFields);
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(7);

                result = getField.call(interpreter, new BrsString("field1"));
                expect(result.value).toEqual(strVal);

                result = getField.call(interpreter, new BrsString("field2"));
                expect(result.value).toEqual(intVal);
            });

            it("doesn't update the value of existing fields if types don't match", () => {
                let node = new RoSGNode([]);
                const strVal = "a string";
                const intVal = -1;
                let initialFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString(strVal) },
                    { name: new BrsString("field2"), value: new Int32(intVal) },
                ]);

                let addFields = node.getMethod("addfields");
                let setFields = node.getMethod("setfields");
                let getField = node.getMethod("getfield");

                let result = addFields.call(interpreter, initialFields);
                expect(result).toEqual(BrsBoolean.True);

                let updatedFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: BrsInvalid.Instance },
                    { name: new BrsString("field2"), value: BrsBoolean.False },
                ]);

                result = setFields.call(interpreter, updatedFields);
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(6);

                result = getField.call(interpreter, new BrsString("field1"));
                expect(result.value).toEqual(strVal);

                result = getField.call(interpreter, new BrsString("field2"));
                expect(result.value).toEqual(intVal);
            });
        });

        describe("update", () => {
            it("updates the value of existing fields", () => {
                let node = new RoSGNode([]);
                const strVal = "updated string";
                const intVal = 666;
                let initialFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString("a string") },
                    { name: new BrsString("field2"), value: new Int32(-1) },
                    { name: new BrsString("field3"), value: BrsBoolean.False },
                ]);

                let addFields = node.getMethod("addfields");
                let update = node.getMethod("update");
                let getField = node.getMethod("getfield");
                expect(update).toBeTruthy();

                let result = addFields.call(interpreter, initialFields);
                expect(result).toEqual(BrsBoolean.True);

                let updatedFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString(strVal) },
                    { name: new BrsString("field2"), value: new Int32(intVal) },
                ]);

                result = update.call(interpreter, updatedFields);
                expect(result).toEqual(Uninitialized.Instance);
                expect(node.getFields().size).toEqual(7);

                result = getField.call(interpreter, new BrsString("field1"));
                expect(result.value).toEqual(strVal);

                result = getField.call(interpreter, new BrsString("field2"));
                expect(result.value).toEqual(intVal);
            });

            it("doesn't update the value of existing fields if types don't match", () => {
                let node = new RoSGNode([]);
                const strVal = "a string";
                const intVal = -1;
                let initialFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString(strVal) },
                    { name: new BrsString("field2"), value: new Int32(intVal) },
                ]);

                let addFields = node.getMethod("addfields");
                let update = node.getMethod("update");
                let getField = node.getMethod("getfield");

                let result = addFields.call(interpreter, initialFields);
                expect(result).toEqual(BrsBoolean.True);

                let updatedFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: BrsInvalid.Instance },
                    { name: new BrsString("field2"), value: BrsBoolean.False },
                ]);

                result = update.call(interpreter, updatedFields);
                expect(result).toEqual(Uninitialized.Instance);
                expect(node.getFields().size).toEqual(6);

                result = getField.call(interpreter, new BrsString("field1"));
                expect(result.value).toEqual(strVal);

                result = getField.call(interpreter, new BrsString("field2"));
                expect(result.value).toEqual(intVal);
            });

            it("doesn't add fields that do not already exist if createFields optional parameter is not passed", () => {
                let node = new RoSGNode([]);
                const strVal = "updated string";
                const intVal = 666;
                let initialFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString("a string") },
                ]);

                let addFields = node.getMethod("addfields");
                let update = node.getMethod("update");
                let getField = node.getMethod("getfield");
                expect(update).toBeTruthy();

                let result = addFields.call(interpreter, initialFields);
                expect(result).toEqual(BrsBoolean.True);

                let updatedFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString(strVal) },
                    { name: new BrsString("field2"), value: new Int32(intVal) },
                ]);

                result = update.call(interpreter, updatedFields);
                expect(result).toEqual(Uninitialized.Instance);
                expect(node.getFields().size).toEqual(5);

                result = getField.call(interpreter, new BrsString("field1"));
                expect(result.value).toEqual(strVal);

                result = getField.call(interpreter, new BrsString("field2"));
                expect(result).toEqual(BrsInvalid.Instance);
            });

            it("doesn't add fields that do not already exist if createFields optional parameter is false", () => {
                let node = new RoSGNode([]);
                const strVal = "updated string";
                const intVal = 666;
                let initialFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString("a string") },
                ]);

                let addFields = node.getMethod("addfields");
                let update = node.getMethod("update");
                let getField = node.getMethod("getfield");
                expect(update).toBeTruthy();

                let result = addFields.call(interpreter, initialFields);
                expect(result).toEqual(BrsBoolean.True);

                let updatedFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString(strVal) },
                    { name: new BrsString("field2"), value: new Int32(intVal) },
                ]);

                result = update.call(interpreter, updatedFields, BrsBoolean.False);
                expect(result).toEqual(Uninitialized.Instance);
                expect(node.getFields().size).toEqual(5);

                result = getField.call(interpreter, new BrsString("field1"));
                expect(result.value).toEqual(strVal);

                result = getField.call(interpreter, new BrsString("field2"));
                expect(result).toEqual(BrsInvalid.Instance);
            });

            it("does add fields that do not already exist if createFields optional parameter is true", () => {
                let node = new RoSGNode([]);
                const strVal = "updated string";
                const intVal = 666;
                let initialFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString("a string") },
                ]);

                let addFields = node.getMethod("addfields");
                let update = node.getMethod("update");
                let getField = node.getMethod("getfield");
                expect(update).toBeTruthy();

                let result = addFields.call(interpreter, initialFields);
                expect(result).toEqual(BrsBoolean.True);

                let updatedFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString(strVal) },
                    { name: new BrsString("field2"), value: new Int32(intVal) },
                ]);

                result = update.call(interpreter, updatedFields, BrsBoolean.True);
                expect(result).toEqual(Uninitialized.Instance);
                expect(node.getFields().size).toEqual(6);

                result = getField.call(interpreter, new BrsString("field1"));
                expect(result.value).toEqual(strVal);

                result = getField.call(interpreter, new BrsString("field2"));
                expect(result.value).toEqual(intVal);
            });
        });
    });

    describe("ifSGNodeChildren", () => {
        let interpreter, parent, child1, child2, child3, child4;

        beforeEach(() => {
            interpreter = new Interpreter();
            parent = new RoSGNode([{ name: new BrsString("parent"), value: new BrsString("1") }]);
            child1 = new RoSGNode([{ name: new BrsString("child"), value: new BrsString("2") }]);
            child2 = new RoSGNode([{ name: new BrsString("child"), value: new BrsString("3") }]);
            child3 = new RoSGNode([{ name: new BrsString("child"), value: new BrsString("4") }]);
            child4 = new RoSGNode([{ name: new BrsString("child"), value: new BrsString("5") }]);
        });

        describe("getchildcount", () => {
            it("returns the number of children", () => {
                let getChildCount = parent.getMethod("getchildcount");
                expect(getChildCount).toBeTruthy();

                let result = getChildCount.call(interpreter);
                expect(result).toEqual(new Int32(0));
            });
        });

        describe("appendchild", () => {
            it("appends a child to the node", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");

                let result = appendChild.call(interpreter, child1);
                let childCount = getChildCount.call(interpreter);
                expect(result).toEqual(BrsBoolean.True);
                expect(appendChild).toBeTruthy();
                expect(childCount).toEqual(new Int32(1));
            });

            it("appends invalid to the node", () => {
                let invalidChild = BrsInvalid.Instance;

                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");

                let result = appendChild.call(interpreter, invalidChild);
                let childCount = getChildCount.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);
                expect(childCount).toEqual(new Int32(0));
            });

            it("doesn't append the same node twice", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");

                let result = appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child1);
                let childCount = getChildCount.call(interpreter);
                expect(result).toEqual(BrsBoolean.True);
                expect(childCount).toEqual(new Int32(1));
            });
        });

        describe("getchildren", () => {
            it("get children of node without children", () => {
                let getChildren = parent.getMethod("getchildren");
                let getChildCount = parent.getMethod("getchildcount");

                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                let childCount = getChildCount.call(interpreter);
                expect(getChildren).toBeTruthy();
                expect(childCount).toEqual(new Int32(0));
                expect(result).toBeInstanceOf(RoArray);
                expect(result.elements).toEqual([]);
            });

            it("get all children of node with children", () => {
                let getChildren = parent.getMethod("getchildren");
                let getChildCount = parent.getMethod("getchildcount");
                let appendChild = parent.getMethod("appendchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);

                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                let childCount = getChildCount.call(interpreter);
                expect(childCount).toEqual(new Int32(3));
                expect(result).toBeInstanceOf(RoArray);
                expect(result.elements).toEqual([child1, child2, child3]);
            });

            it("get last two children", () => {
                let getChildren = parent.getMethod("getchildren");
                let getChildCount = parent.getMethod("getchildcount");
                let appendChild = parent.getMethod("appendchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);
                appendChild.call(interpreter, child4);

                // get last 2 children
                let result = getChildren.call(interpreter, new Int32(2), new Int32(2));
                let childCount = getChildCount.call(interpreter);
                expect(childCount).toEqual(new Int32(4));
                expect(result).toBeInstanceOf(RoArray);
                expect(result.elements).toEqual([child3, child4]);
            });

            it("pass in large child count", () => {
                let getChildren = parent.getMethod("getchildren");
                let getChildCount = parent.getMethod("getchildcount");
                let appendChild = parent.getMethod("appendchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);
                appendChild.call(interpreter, child4);

                // pass in more children count than there are children, should just return 2 with offset of 2
                let result1 = getChildren.call(interpreter, new Int32(20), new Int32(2));
                expect(result1).toBeInstanceOf(RoArray);
                expect(result1.elements).toEqual([child3, child4]);
            });

            it("pass in negative indices", () => {
                let getChildren = parent.getMethod("getchildren");
                let getChildCount = parent.getMethod("getchildcount");
                let appendChild = parent.getMethod("appendchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);
                appendChild.call(interpreter, child4);

                // pass in negative indices
                let result2 = getChildren.call(interpreter, new Int32(-10), new Int32(-50));
                expect(result2).toBeInstanceOf(RoArray);
                expect(result2.elements).toEqual([]);
            });

            it("pass in negative start index", () => {
                let getChildren = parent.getMethod("getchildren");
                let getChildCount = parent.getMethod("getchildcount");
                let appendChild = parent.getMethod("appendchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);
                appendChild.call(interpreter, child4);

                // pass in just negative start index
                let result3 = getChildren.call(interpreter, new Int32(5), new Int32(-50));
                expect(result3).toBeInstanceOf(RoArray);
                expect(result3.elements).toEqual([]);
            });

            it("get first 3 children", () => {
                let getChildren = parent.getMethod("getchildren");
                let getChildCount = parent.getMethod("getchildcount");
                let appendChild = parent.getMethod("appendchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);
                appendChild.call(interpreter, child4);

                // get first 3 children
                let result4 = getChildren.call(interpreter, new Int32(3), new Int32(0));
                expect(result4).toBeInstanceOf(RoArray);
                expect(result4.elements).toEqual([child1, child2, child3]);
            });
        });

        describe("removechild", () => {
            it("remove a child node from parent", () => {
                let removeChild = parent.getMethod("removechild");
                let getChildren = parent.getMethod("getchildren");
                let getChildCount = parent.getMethod("getchildcount");
                let appendChild = parent.getMethod("appendchild");
                expect(removeChild).toBeTruthy();

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);

                // remove child 2
                removeChild.call(interpreter, child2);
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                let childCount = getChildCount.call(interpreter);
                expect(childCount).toEqual(new Int32(2));
                expect(result).toBeInstanceOf(RoArray);
                expect(result.elements).toEqual([child1, child3]);

                // remove child 3
                removeChild.call(interpreter, child3);
                let result1 = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                let childCount1 = getChildCount.call(interpreter);
                expect(childCount1).toEqual(new Int32(1));
                expect(result1).toBeInstanceOf(RoArray);
                expect(result1.elements).toEqual([child1]);

                // remove child 1
                removeChild.call(interpreter, child1);
                let result2 = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                let childCount2 = getChildCount.call(interpreter);
                expect(childCount2).toEqual(new Int32(0));
                expect(result2).toBeInstanceOf(RoArray);
                expect(result2.elements).toEqual([]);

                // try to remove child 1 again, but shouldn't do anything
                removeChild.call(interpreter, child1);
                let result3 = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                let childCount3 = getChildCount.call(interpreter);
                expect(childCount3).toEqual(new Int32(0));
                expect(result3).toBeInstanceOf(RoArray);
                expect(result3.elements).toEqual([]);
            });

            it("remove non-node things from parent", () => {
                let removeChild = parent.getMethod("removechild");
                let getChildren = parent.getMethod("getchildren");
                let getChildCount = parent.getMethod("getchildcount");
                let appendChild = parent.getMethod("appendchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);

                // only returns true if we are removing roSGNode type object
                let result = removeChild.call(interpreter, child1);
                expect(result).toEqual(BrsBoolean.True);
                let result1 = removeChild.call(interpreter, new BrsString("some string"));
                expect(result1).toEqual(BrsBoolean.False);
                let result2 = removeChild.call(interpreter, new Int32(5));
                expect(result2).toEqual(BrsBoolean.False);
                let childCount = getChildCount.call(interpreter);
                expect(childCount).toEqual(new Int32(2));
            });
        });

        describe("getparent", () => {
            it("get parent of node", () => {
                let getParent = child1.getMethod("getparent");
                let appendChild = parent.getMethod("appendchild");

                appendChild.call(interpreter, child1);
                let parentNode = getParent.call(interpreter);
                expect(getParent).toBeTruthy();
                expect(parentNode).toEqual(parent);
            });

            it("get parent of node without parent", () => {
                let getParent = child1.getMethod("getparent");
                let appendChild = parent.getMethod("appendchild");
                let removeChild = parent.getMethod("removechild");

                // node should start without a parent
                let parentNode = getParent.call(interpreter);
                expect(parentNode).toEqual(BrsInvalid.Instance);

                // appends a node as child
                appendChild.call(interpreter, child1);
                let parentNode1 = getParent.call(interpreter);
                expect(parentNode1).toEqual(parent);

                // remove parent from child again, should get invalid as parent
                removeChild.call(interpreter, child1);
                let parentNode2 = getParent.call(interpreter);
                expect(parentNode2).toEqual(BrsInvalid.Instance);
            });
        });

        describe("createchild", () => {
            it("create generic roSGNode as child", () => {
                let createChild = parent.getMethod("createchild");
                let getChildren = parent.getMethod("getchildren");

                let childNode = createChild.call(interpreter, new BrsString("Node"));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(createChild).toBeTruthy();
                expect(result.elements[0]).toEqual(childNode);
            });
        });

        describe("replacechild", () => {
            it("replaces an existing child with a new node", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChild = parent.getMethod("replacechild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childReplaced = replaceChild.call(interpreter, child3, new Int32(0));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements[0]).toEqual(child3);
            });

            it("returns false if index is greater than length of array", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChild = parent.getMethod("replacechild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childReplaced = replaceChild.call(interpreter, child3, new Int32(2));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(false);
                expect(result.elements[0]).toEqual(child1);
                expect(result.elements[1]).toEqual(child2);
            });

            it("returns true and does nothing for negative index and new element is not a child", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChild = parent.getMethod("replacechild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childReplaced = replaceChild.call(interpreter, child3, new Int32(-2));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements[0]).toEqual(child1);
                expect(result.elements[1]).toEqual(child2);
            });

            it("replaces existing child", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChild = parent.getMethod("replacechild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childReplaced = replaceChild.call(interpreter, child2, new Int32(0));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(1);
                expect(result.elements[0]).toEqual(child2);
            });

            it("replaces existing child at same index", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChild = parent.getMethod("replacechild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childReplaced = replaceChild.call(interpreter, child1, new Int32(0));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(1);
                expect(result.elements[0]).toEqual(child1);
            });

            it("removes existing child for negative index", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChild = parent.getMethod("replacechild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childReplaced = replaceChild.call(interpreter, child2, new Int32(-1));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(1);
                expect(result.elements[0]).toEqual(child1);
            });

            it("replaces existing child amongst 4 children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChild = parent.getMethod("replacechild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);
                appendChild.call(interpreter, child4);

                let childReplaced = replaceChild.call(interpreter, child2, new Int32(2));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));

                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(3);
                expect(result.elements[0]).toEqual(child1);
                expect(result.elements[2]).toEqual(child2);
            });

            it("replaces existing child amongst 4 children at the end", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChild = parent.getMethod("replacechild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);
                appendChild.call(interpreter, child4);

                let childReplaced = replaceChild.call(interpreter, child2, new Int32(3));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));

                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(4);
                expect(result.elements[0]).toEqual(child1);
                expect(result.elements[1]).toEqual(child3);
                expect(result.elements[3]).toEqual(child2);
            });
        });
        describe("replacechildren", () => {
            it("replaces children with new nodes", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChildren = parent.getMethod("replacechildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childReplaced = replaceChildren.call(
                    interpreter,
                    new RoArray([child3, child4]),
                    new Int32(0)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(2);
                expect(result.elements[0]).toEqual(child3);
            });

            it("replaces children with new nodes that are more than number of children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChildren = parent.getMethod("replacechildren");

                appendChild.call(interpreter, child1);

                let childReplaced = replaceChildren.call(
                    interpreter,
                    new RoArray([child2, child3]),
                    new Int32(0)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(1);
                expect(result.elements[0]).toEqual(child2);
            });

            it("returns false for an empty array of new nodes", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChildren = parent.getMethod("replacechildren");

                appendChild.call(interpreter, child1);

                let childReplaced = replaceChildren.call(
                    interpreter,
                    new RoArray([]),
                    new Int32(0)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(false);
                expect(result.elements.length).toEqual(1);
                expect(result.elements[0]).toEqual(child1);
            });

            it("returns true and does nothing new nodes and index greater than number of elements in children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChildren = parent.getMethod("replacechildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childReplaced = replaceChildren.call(
                    interpreter,
                    new RoArray([child3, child4]),
                    new Int32(2)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(2);
                expect(result.elements[0]).toEqual(child1);
            });

            it("negative index rolls over to positive index and then replaces", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChildren = parent.getMethod("replacechildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childReplaced = replaceChildren.call(
                    interpreter,
                    new RoArray([child3, child4]),
                    new Int32(-1)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(2);
                expect(result.elements[0]).toEqual(child4);
            });

            it("replaces existing nodes after negative index rollover", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChildren = parent.getMethod("replacechildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);
                appendChild.call(interpreter, child4);

                let childReplaced = replaceChildren.call(
                    interpreter,
                    new RoArray([child1, child2]),
                    new Int32(-1)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(2);
                expect(result.elements[0]).toEqual(child2);
                expect(result.elements[1]).toEqual(child4);
            });

            it("removes existing nodes for index greater than number of children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let replaceChildren = parent.getMethod("replacechildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);
                appendChild.call(interpreter, child4);

                let childReplaced = replaceChildren.call(
                    interpreter,
                    new RoArray([child1, child2]),
                    new Int32(11)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childReplaced.value).toEqual(true);
                expect(result.elements.length).toEqual(2);
                expect(result.elements[0]).toEqual(child3);
                expect(result.elements[1]).toEqual(child4);
            });
        });
        describe("insertchild", () => {
            it("inserts a new node in the middle", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let insertChild = parent.getMethod("insertchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);

                let childInserted = insertChild.call(interpreter, child4, new Int32(1));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childInserted.value).toEqual(true);
                expect(result.elements[1]).toEqual(child4);
            });

            it("inserts a new node at index more than number of children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let insertChild = parent.getMethod("insertchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childInserted = insertChild.call(interpreter, child3, new Int32(11));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childInserted.value).toEqual(true);
                expect(result.elements[2]).toEqual(child3);
            });

            it("inserts a new node with negative index", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let insertChild = parent.getMethod("insertchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childInserted = insertChild.call(interpreter, child3, new Int32(-1));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childInserted.value).toEqual(true);
                expect(result.elements[2]).toEqual(child3);
            });

            it("inserts an existing node", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let insertChild = parent.getMethod("insertchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);

                let childInserted = insertChild.call(interpreter, child2, new Int32(0));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childInserted.value).toEqual(true);
                expect(result.elements[0]).toEqual(child2);
            });
        });
        describe("insertchildren", () => {
            it("inserts new nodes in the middle", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let insertChildren = parent.getMethod("insertchildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childrenInserted = insertChildren.call(
                    interpreter,
                    new RoArray([child3, child4]),
                    new Int32(1)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenInserted.value).toEqual(true);
                expect(result.elements.length).toEqual(4);
                expect(result.elements[1]).toEqual(child3);
            });

            it("inserts new nodes at index more than number of children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let insertChildren = parent.getMethod("insertchildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childrenInserted = insertChildren.call(
                    interpreter,
                    new RoArray([child3, child4]),
                    new Int32(11)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenInserted.value).toEqual(true);
                expect(result.elements.length).toEqual(4);
                expect(result.elements[2]).toEqual(child3);
            });

            it("inserts new and existing nodes", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let insertChildren = parent.getMethod("insertchildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childrenInserted = insertChildren.call(
                    interpreter,
                    new RoArray([child2, child4]),
                    new Int32(0)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenInserted.value).toEqual(true);
                expect(result.elements.length).toEqual(3);
                expect(result.elements[0]).toEqual(child2);
            });

            it("inserts new and existing nodes with negative index", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let insertChildren = parent.getMethod("insertchildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childrenInserted = insertChildren.call(
                    interpreter,
                    new RoArray([child1, child4]),
                    new Int32(-11)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenInserted.value).toEqual(true);
                expect(result.elements.length).toEqual(3);
                expect(result.elements[0]).toEqual(child2);
            });

            it("inserts new and existing nodes with negative index with rollover", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let insertChildren = parent.getMethod("insertchildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);

                let childrenInserted = insertChildren.call(
                    interpreter,
                    new RoArray([child2, child4]),
                    new Int32(-1)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenInserted.value).toEqual(true);
                expect(result.elements.length).toEqual(4);
                expect(result.elements[0]).toEqual(child4);
                expect(result.elements[3]).toEqual(child2);
            });

            it("returns false for empty array", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let insertChildren = parent.getMethod("insertchildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childrenInserted = insertChildren.call(
                    interpreter,
                    new RoArray([]),
                    new Int32(-1)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenInserted.value).toEqual(false);
                expect(result.elements.length).toEqual(2);
            });
        });
        describe("getchild", () => {
            it("gets an existing child", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChild = parent.getMethod("getchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let existingChild = getChild.call(interpreter, new Int32(1));
                expect(existingChild).toBeInstanceOf(RoSGNode);
                expect(existingChild).toBe(child2);
            });

            it("returns invalid for index greater than number of children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChild = parent.getMethod("getchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let existingChild = getChild.call(interpreter, new Int32(5));
                expect(existingChild).toBeInstanceOf(BrsInvalid);
            });

            it("returns invalid for negative index", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChild = parent.getMethod("getchild");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let existingChild = getChild.call(interpreter, new Int32(-1));
                expect(existingChild).toBeInstanceOf(BrsInvalid);
            });
        });
        describe("removechildren", () => {
            it("removes nodes that exist", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let removeChildren = parent.getMethod("removechildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);

                let childrenRemoved = removeChildren.call(
                    interpreter,
                    new RoArray([child1, child3, child4])
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenRemoved.value).toEqual(true);
                expect(result.elements[0]).toEqual(child2);
            });

            it("returns false for empty array", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let removeChildren = parent.getMethod("removechildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childrenRemoved = removeChildren.call(interpreter, new RoArray([]));
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenRemoved.value).toEqual(false);
                expect(result.elements.length).toEqual(2);
            });
        });
        describe("removechildrenindex", () => {
            it("removes nodes that exist", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let removeChildrenIndex = parent.getMethod("removechildrenindex");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);
                appendChild.call(interpreter, child3);

                let childrenRemoved = removeChildrenIndex.call(
                    interpreter,
                    new Int32(2),
                    new Int32(0)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenRemoved.value).toEqual(true);
                expect(result.elements[0]).toEqual(child3);
            });

            it("returns true and does nothing for index greater than number of children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let removeChildrenIndex = parent.getMethod("removechildrenindex");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childrenRemoved = removeChildrenIndex.call(
                    interpreter,
                    new Int32(2),
                    new Int32(5)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenRemoved.value).toEqual(true);
                expect(result.elements[0]).toEqual(child1);
            });

            it("returns false num_children less than or equal to 0", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let removeChildrenIndex = parent.getMethod("removechildrenindex");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childrenRemoved = removeChildrenIndex.call(
                    interpreter,
                    new Int32(-1),
                    new Int32(0)
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenRemoved.value).toEqual(false);
                expect(result.elements.length).toEqual(2);
            });
        });
        describe("appendchildren", () => {
            it("appends new nodes", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let appendChildren = parent.getMethod("appendchildren");

                appendChild.call(interpreter, child1);

                let childrenAppended = appendChildren.call(
                    interpreter,
                    new RoArray([child2, child3])
                );
                let result = getChildCount.call(interpreter);
                expect(childrenAppended.value).toEqual(true);
                expect(result).toEqual(new Int32(3));
            });

            it("doesn't duplicate existing children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildren = parent.getMethod("getchildren");
                let appendChildren = parent.getMethod("appendchildren");

                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child2);

                let childrenAppended = appendChildren.call(
                    interpreter,
                    new RoArray([child3, child1])
                );
                let result = getChildren.call(interpreter, new Int32(-1), new Int32(0));
                expect(childrenAppended.value).toEqual(true);
                expect(result.elements[0]).toEqual(child2);
            });

            it("returns false for empty array", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let appendChildren = parent.getMethod("appendchildren");

                appendChild.call(interpreter, child1);

                let childrenAppended = appendChildren.call(interpreter, new RoArray([]));
                let result = getChildCount.call(interpreter);
                expect(childrenAppended.value).toEqual(false);
                expect(result).toEqual(new Int32(1));
            });
        });
        describe("createchildren", () => {
            it("creates and appends generic RoSGNode as children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let createChildren = parent.getMethod("createchildren");

                appendChild.call(interpreter, child1);

                let createdChildren = createChildren.call(
                    interpreter,
                    new Int32(2),
                    new BrsString("Node")
                );
                let result = getChildCount.call(interpreter);
                expect(createdChildren).toBeInstanceOf(RoArray);
                expect(createdChildren.elements.length).toEqual(2);
                expect(result).toEqual(new Int32(3));
            });

            it("doesn't create if number to create is less than or equal to 0", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let createChildren = parent.getMethod("createchildren");

                appendChild.call(interpreter, child1);

                let createdChildren = createChildren.call(
                    interpreter,
                    new Int32(0),
                    new BrsString("Node")
                );
                let result = getChildCount.call(interpreter);
                expect(createdChildren).toBeInstanceOf(RoArray);
                expect(createdChildren.elements.length).toEqual(0);
                expect(result).toEqual(new Int32(1));
            });
        });
        describe("removechildindex", () => {
            it("removes a child with correct index", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let removeChildIndex = parent.getMethod("removechildindex");

                appendChild.call(interpreter, child1);

                let childRemoved = removeChildIndex.call(interpreter, new Int32(0));
                let result = getChildCount.call(interpreter);
                expect(childRemoved.value).toEqual(true);
                expect(result).toEqual(new Int32(0));
            });

            it("returns true for negative index", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let removeChildIndex = parent.getMethod("removechildindex");

                appendChild.call(interpreter, child1);

                let childRemoved = removeChildIndex.call(interpreter, new Int32(-1));
                let result = getChildCount.call(interpreter);
                expect(childRemoved.value).toEqual(true);
                expect(result).toEqual(new Int32(1));
            });

            it("returns false for index greater than number of children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let removeChildIndex = parent.getMethod("removechildindex");

                appendChild.call(interpreter, child1);

                let childRemoved = removeChildIndex.call(interpreter, new Int32(1));
                let result = getChildCount.call(interpreter);
                expect(childRemoved.value).toEqual(false);
                expect(result).toEqual(new Int32(1));
            });
        });
        describe("removechildindex", () => {
            it("removes a child with correct index", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let removeChildIndex = parent.getMethod("removechildindex");

                appendChild.call(interpreter, child1);

                let childRemoved = removeChildIndex.call(interpreter, new Int32(0));
                let result = getChildCount.call(interpreter);
                expect(childRemoved.value).toEqual(true);
                expect(result).toEqual(new Int32(0));
            });

            it("returns true for negative index", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let removeChildIndex = parent.getMethod("removechildindex");

                appendChild.call(interpreter, child1);

                let childRemoved = removeChildIndex.call(interpreter, new Int32(-1));
                let result = getChildCount.call(interpreter);
                expect(childRemoved.value).toEqual(true);
                expect(result).toEqual(new Int32(1));
            });

            it("returns false for index greater than number of children", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let removeChildIndex = parent.getMethod("removechildindex");

                appendChild.call(interpreter, child1);

                let childRemoved = removeChildIndex.call(interpreter, new Int32(1));
                let result = getChildCount.call(interpreter);
                expect(childRemoved.value).toEqual(false);
                expect(result).toEqual(new Int32(1));
            });
        });
        describe("reparent", () => {
            it("reparents to another node", () => {
                let appendChild = parent.getMethod("appendchild");
                let getParent = child1.getMethod("getparent");
                let reparent = child1.getMethod("reparent");

                appendChild.call(interpreter, child1);

                let childReparented = reparent.call(interpreter, child2, BrsBoolean.False);
                let result = getParent.call(interpreter);
                expect(childReparented.value).toEqual(true);
                expect(result).toEqual(child2);
            });

            it("doesn't reparent to itself", () => {
                let appendChild = parent.getMethod("appendchild");
                let getParent = child1.getMethod("getparent");
                let reparent = child1.getMethod("reparent");

                appendChild.call(interpreter, child1);

                let childReparented = reparent.call(interpreter, child1, BrsBoolean.False);
                let result = getParent.call(interpreter);
                expect(childReparented.value).toEqual(false);
                expect(result).toEqual(parent);
            });

            it("child relation is removed from previous parent", () => {
                let appendChild = parent.getMethod("appendchild");
                let getChildCount = parent.getMethod("getchildcount");
                let reparent = child1.getMethod("reparent");

                appendChild.call(interpreter, child1);

                let childReparented = reparent.call(interpreter, child2, BrsBoolean.False);
                let result = getChildCount.call(interpreter);
                expect(childReparented.value).toEqual(true);
                expect(result.value).toEqual(0);
            });
        });
    });

    describe("ifSGNodeFocus", () => {
        let interpreter, parent, child1, child2, grandChild1, grandChild2;

        beforeEach(() => {
            interpreter = new Interpreter();
            parent = new RoSGNode([{ name: new BrsString("parent"), value: new BrsString("1") }]);
            child1 = new RoSGNode([{ name: new BrsString("child"), value: new BrsString("2") }]);
            child2 = new RoSGNode([{ name: new BrsString("child"), value: new BrsString("3") }]);
            grandChild1 = new RoSGNode([
                { name: new BrsString("grandChild"), value: new BrsString("4") },
            ]);
            grandChild2 = new RoSGNode([
                { name: new BrsString("grandChild"), value: new BrsString("5") },
            ]);
        });

        describe("hasfocus", () => {
            it("check if unfocused node has focus", () => {
                let hasFocus = parent.getMethod("hasfocus");
                expect(hasFocus).toBeTruthy();

                let result = hasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);
            });
        });

        describe("setfocus", () => {
            let focusedChildString = new BrsString("focusedchild");
            it("sets focus on a node", () => {
                let hasFocus = parent.getMethod("hasfocus");
                let setFocus = parent.getMethod("setfocus");
                expect(setFocus).toBeTruthy();

                let result = hasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);
                setFocus.call(interpreter, BrsBoolean.True);
                result = hasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.True);
                expect(parent.get(focusedChildString)).toEqual(parent);
            });

            it("sets focus on a node should disable focus on another", () => {
                let child1HasFocus = child1.getMethod("hasfocus");
                let child2HasFocus = child2.getMethod("hasfocus");
                let child1SetFocus = child1.getMethod("setfocus");
                let child2SetFocus = child2.getMethod("setfocus");

                //by default both child1 and child2 should have no focus
                let result = child1HasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);
                result = child2HasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);

                // by default their focusedChild fields should be invalid
                expect(child1.get(focusedChildString)).toEqual(BrsInvalid.Instance);
                expect(child2.get(focusedChildString)).toEqual(BrsInvalid.Instance);

                //focus on child 1
                child1SetFocus.call(interpreter, BrsBoolean.True);
                result = child1HasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.True);
                result = child2HasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);
                expect(child1.get(focusedChildString)).toEqual(child1);
                expect(child2.get(focusedChildString)).toEqual(BrsInvalid.Instance);

                //focus on child 2 should remove focus from child 1
                child2SetFocus.call(interpreter, BrsBoolean.True);
                result = child1HasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);
                result = child2HasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.True);
                expect(child2.get(focusedChildString)).toEqual(child2);
                expect(child1.get(focusedChildString)).toEqual(BrsInvalid.Instance);
            });

            it("set focus to false", () => {
                let child1HasFocus = child1.getMethod("hasfocus");
                let child2HasFocus = child2.getMethod("hasfocus");
                let child1SetFocus = child1.getMethod("setfocus");
                let child2SetFocus = child2.getMethod("setfocus");

                //focus on child 1
                child1SetFocus.call(interpreter, BrsBoolean.True);
                result = child1HasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.True);
                result = child2HasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);
                expect(child1.get(focusedChildString)).toEqual(child1);
                expect(child2.get(focusedChildString)).toEqual(BrsInvalid.Instance);

                //set focus to false on child 1
                child1SetFocus.call(interpreter, BrsBoolean.False);
                result = child1HasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);
                result = child2HasFocus.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);
                expect(child1.get(focusedChildString)).toEqual(BrsInvalid.Instance);
                expect(child2.get(focusedChildString)).toEqual(BrsInvalid.Instance);
            });
        });

        describe("isinfocuschain", () => {
            it("parent node has focus", () => {
                let isInFocusChain = parent.getMethod("isinfocuschain");
                let setFocus = parent.getMethod("setfocus");
                expect(isInFocusChain).toBeTruthy();

                let result = isInFocusChain.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);

                setFocus.call(interpreter, BrsBoolean.True);
                result = isInFocusChain.call(interpreter);
                expect(result).toEqual(BrsBoolean.True);
            });

            /** Create a node tree in the follow structure:
             *                  parent
             *               //        \\
             *            child1       child2
             *           //              \\
             *       grandChild1       grandChild2
             */
            it("grand child has focus", () => {
                let isInFocusChain = parent.getMethod("isinfocuschain");
                let parentAppendChild = parent.getMethod("appendchild");
                let child1AppendChild = child1.getMethod("appendchild");
                let child2AppendChild = child2.getMethod("appendchild");
                let grandChild2SetFocus = grandChild2.getMethod("setfocus");

                parentAppendChild.call(interpreter, child1);
                parentAppendChild.call(interpreter, child2);
                child1AppendChild.call(interpreter, grandChild1);
                child2AppendChild.call(interpreter, grandChild2);

                // by default nothing has focus yet
                let result = isInFocusChain.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);

                // set focus on grand child 2
                grandChild2SetFocus.call(interpreter, BrsBoolean.True);
                result = isInFocusChain.call(interpreter);
                expect(result).toEqual(BrsBoolean.True);

                // unset focus on grand child 2
                grandChild2SetFocus.call(interpreter, BrsBoolean.False);
                result = isInFocusChain.call(interpreter);
                expect(result).toEqual(BrsBoolean.False);
            });
        });
    });

    describe("ifSGNodeDict", () => {
        let interpreter, parent, child1, child2, child3, child4;

        beforeEach(() => {
            interpreter = new Interpreter();
            let idString = new BrsString("id");
            parent = new RoSGNode([{ name: idString, value: new BrsString("root") }]);
            child1 = new RoSGNode([{ name: idString, value: new BrsString("child1") }]);
            child2 = new RoSGNode([{ name: idString, value: new BrsString("child2") }]);
            child3 = new RoSGNode([{ name: idString, value: new BrsString("child3") }]);
            child4 = new RoSGNode([{ name: idString, value: new BrsString("child4") }]);
            child5 = new RoSGNode([{ name: idString, value: new BrsString("") }]);
        });

        describe("findnode", () => {
            it("returns invalid if no node is found", () => {
                let findNode = parent.getMethod("findnode");
                expect(findNode).toBeTruthy();

                let invalidNode = findNode.call(interpreter, new BrsString("someRandomId"));
                expect(invalidNode).toEqual(BrsInvalid.Instance);
            });

            it("returns invalid on empty id string", () => {
                let findNode = parent.getMethod("findnode");

                let invalidNode = findNode.call(interpreter, new BrsString(""));
                expect(invalidNode).toEqual(BrsInvalid.Instance);
            });

            it("finds itself", () => {
                let findNode = parent.getMethod("findnode");

                let result = findNode.call(interpreter, new BrsString("root"));
                expect(result).toBeTruthy();
                expect(result).toBe(parent);
            });

            it("finds a node in its direct children", () => {
                let appendChild = parent.getMethod("appendchild");
                let children = [child1, child2, child3, child4];
                for (let child of children) {
                    appendChild.call(interpreter, child);
                }

                let findNode = parent.getMethod("findnode");
                let result = findNode.call(interpreter, new BrsString("child3"));
                expect(result).toBeTruthy();
                expect(child3).toBe(result);
            });

            it("finds a grandchild", () => {
                let appendGrandChild = child4.getMethod("appendchild");
                appendGrandChild.call(interpreter, child3);

                let appendChild = parent.getMethod("appendchild");
                let children = [child1, child2, child4];
                for (let child of children) {
                    appendChild.call(interpreter, child);
                }

                let findNode = parent.getMethod("findNode");
                let result = findNode.call(interpreter, new BrsString("child3"));
                expect(result).toBeTruthy();
                expect(child3).toBe(result);
            });

            it("finds a cousin", () => {
                let appendChild1 = child1.getMethod("appendchild");
                appendChild1.call(interpreter, child2);

                let appendChild3 = child3.getMethod("appendchild");
                appendChild3.call(interpreter, child4);

                let appendChild = parent.getMethod("appendChild");
                appendChild.call(interpreter, child1);
                appendChild.call(interpreter, child3);

                let findNode = child2.getMethod("findnode");
                let result = findNode.call(interpreter, new BrsString("child4"));
                expect(result).toBeTruthy();
                expect(child4).toBe(result);
            });

            it("finds a sibling node", () => {
                let appendChild = parent.getMethod("appendchild");
                let children = [child1, child2, child3, child4];
                for (let child of children) {
                    appendChild.call(interpreter, child);
                }

                let findNode = child4.getMethod("findnode");
                let result = findNode.call(interpreter, new BrsString("child1"));
                expect(result).toBeTruthy();
                expect(child1).toBe(result);
            });

            it("finds its grandparent", () => {
                let appendChild4 = child4.getMethod("appendchild");
                appendChild4.call(interpreter, child3);

                let appendChild = parent.getMethod("appendchild");
                let children = [child1, child2, child4];
                for (let child of children) {
                    appendChild.call(interpreter, child);
                }

                let findNode = child3.getMethod("findNode");
                let result = findNode.call(interpreter, new BrsString("root"));
                expect(result).toBeTruthy();
                expect(parent).toBe(result);
            });
        });

        describe("issamenode", () => {
            it("returns true if the nodes are the same", () => {
                let isSameNode = parent.getMethod("issamenode");
                expect(isSameNode).toBeTruthy();

                let result = isSameNode.call(interpreter, parent);
                expect(result).toBe(BrsBoolean.True);
            });

            it("returns false if the nodes are different", () => {
                let isSameNode = parent.getMethod("issamenode");

                let result = isSameNode.call(interpreter, child4);
                expect(result).toBe(BrsBoolean.False);
            });
        });

        describe("subtype", () => {
            it("returns 'Node' for Node roSGNode", () => {
                let subtype = parent.getMethod("subtype");
                expect(subtype).toBeTruthy();

                let result = subtype.call(interpreter);
                expect(result.value).toBe("Node");
            });

            it("returns type for arbitrary roSGNode", () => {
                let someNode = new RoSGNode(
                    [{ name: new BrsString("id"), value: new BrsString("someNode") }],
                    "randomType"
                );
                let subtype = someNode.getMethod("subtype");

                let result = subtype.call(interpreter);
                expect(result.value).toBe("randomType");
            });

            describe("issubtype", () => {
                class ParentComponent extends RoSGNode {
                    constructor(name = "ParentComponent") {
                        super([], name);
                    }
                }

                class ChildComponent extends ParentComponent {
                    constructor(name = "ChildComponent") {
                        super(name);
                    }
                }

                it("returns true for all ancestor types, false otherwise", () => {
                    let childNode = new ChildComponent();
                    let issubtype = childNode.getMethod("issubtype");

                    expect(issubtype.call(interpreter, new BrsString("ChildComponent")).value).toBe(
                        true
                    );
                    expect(
                        issubtype.call(interpreter, new BrsString("ParentComponent")).value
                    ).toBe(true);
                    expect(issubtype.call(interpreter, new BrsString("Node")).value).toBe(true);

                    let parentNode = new ParentComponent();
                    issubtype = parentNode.getMethod("issubtype");

                    expect(issubtype.call(interpreter, new BrsString("ChildComponent")).value).toBe(
                        false
                    );
                    expect(issubtype.call(interpreter, new BrsString("MarkupGrid")).value).toBe(
                        false
                    );
                });

                it("is case-insensitive", () => {
                    let childNode = new ChildComponent();
                    let issubtype = childNode.getMethod("issubtype");

                    expect(issubtype.call(interpreter, new BrsString("Node")).value).toBe(true);
                    expect(issubtype.call(interpreter, new BrsString("node")).value).toBe(true);
                    expect(issubtype.call(interpreter, new BrsString("NODE")).value).toBe(true);
                });

                it("does isSubType for other built in components", () => {
                    let markupNode = new MarkupGrid();
                    let issubtype = markupNode.getMethod("issubtype");

                    expect(issubtype.call(interpreter, new BrsString("MarkupGrid")).value).toBe(
                        true
                    );
                    expect(issubtype.call(interpreter, new BrsString("ArrayGrid")).value).toBe(
                        true
                    );
                    expect(issubtype.call(interpreter, new BrsString("Node")).value).toBe(true);
                });
            });

            describe("parentsubtype", () => {
                it("returns the parent subtype", () => {
                    let markupNode = new MarkupGrid();
                    let parentsubtype = markupNode.getMethod("parentsubtype");

                    let result = parentsubtype.call(interpreter, new BrsString("MarkUpGrid"));
                    expect(result.value).toBe("ArrayGrid");
                });

                it("returns invalid if it does not exist", () => {
                    let node = new RoSGNode([]);
                    let parentsubtype = node.getMethod("parentsubtype");

                    let result = parentsubtype.call(interpreter, new BrsString("UnknownNode"));
                    expect(result).toBe(BrsInvalid.Instance);
                });
            });
        });
    });

    describe("ifSGNodeBoundingRect", () => {
        let interpreter, node;

        beforeEach(() => {
            interpreter = new Interpreter();
            node = new RoSGNode([{ name: new BrsString("id"), value: new BrsString("root") }]);
        });

        it("should return bounding rect", () => {
            let boundingRectCall = node.getMethod("boundingRect");
            expect(boundingRectCall).toBeTruthy();
            let result = boundingRectCall.call(interpreter);
            expect(result).toBeTruthy();
        });
    });
});
