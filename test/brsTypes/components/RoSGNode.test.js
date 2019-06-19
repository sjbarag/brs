const brs = require("brs");
const {
    RoAssociativeArray,
    RoSGNode,
    RoArray,
    BrsBoolean,
    BrsString,
    Int32,
    BrsInvalid,
    ValueKind,
} = brs.types;
const { Interpreter } = require("../../../lib/interpreter");

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
                { name: new BrsString("invalid"), value: BrsInvalid.Instance },
            ]);
            expect(node.toString()).toEqual(
                `<Component: roSGNode:Node> =
{
    array: <Component: roArray>
    associative-array: <Component: roAssociativeArray>
    node: <Component: roSGNode:Node>
    boolean: true
    string: a string
    number: -1
    invalid: invalid
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

        it("overwrites values with existing keys", () => {
            let node = new RoSGNode([{ name: new BrsString("foo"), value: new Int32(-99) }]);

            node.set(new BrsString("foo"), new BrsString("not ninetynine"));

            expect(node.get(new BrsString("foo"))).toEqual(new BrsString("not ninetynine"));
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
                expect(node.elements).toEqual(new Map());
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
                expect(deleteCall.call(interpreter, new BrsString("baz"))).toBe(BrsBoolean.False);
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
                expect(result).toEqual(new Int32(2));
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
                expect(result.elements).toEqual(new RoArray([cletter, letter1, letter2]).elements);
            });

            it("returns an empty array from an empty associative array", () => {
                let node = new RoSGNode([]);

                let keys = node.getMethod("keys");
                expect(keys).toBeTruthy();

                let result = keys.call(interpreter);
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });

        describe("items", () => {
            it("returns an array of values from the associative array in lexicographical order", () => {
                let cletter = new BrsString("c");
                let letter1 = new BrsString("a");
                let letter2 = new BrsString("b");

                let node = new RoSGNode([
                    { name: new BrsString("cletter"), value: cletter },
                    { name: new BrsString("letter1"), value: letter1 },
                    { name: new BrsString("letter2"), value: letter2 },
                ]);

                let items = node.getMethod("items");
                expect(items).toBeTruthy();
                let result = items.call(interpreter);
                expect(result.elements).toEqual(new RoArray([letter1, letter2, cletter]).elements);
            });

            it("returns an empty array from an empty associative array", () => {
                let node = new RoSGNode([]);

                let items = node.getMethod("items");
                expect(items).toBeTruthy();

                let result = items.call(interpreter);
                expect(result.elements).toEqual(new RoArray([]).elements);
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
                expect(node.getFields().size).toEqual(1);
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
                expect(node.getFields().size).toEqual(0);
            });
        });

        describe("addfields", () => {
            it("adds multiple field to the object", () => {
                let node = new RoSGNode([]);
                let fields = new RoAssociativeArray([
                    { name: new BrsString("associative-array"), value: new RoAssociativeArray([]) },
                    { name: new BrsString("node"), value: new RoSGNode([]) },
                    { name: new BrsString("boolean"), value: BrsBoolean.True },
                    { name: new BrsString("string"), value: new BrsString("a string") },
                    { name: new BrsString("number"), value: new Int32(-1) },
                    { name: new BrsString("invalid"), value: BrsInvalid.Instance },
                ]);

                let addFields = node.getMethod("addfields");
                expect(addFields).toBeTruthy();

                let result = addFields.call(interpreter, fields);
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(6);
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
                expect(node.getFields().size).toEqual(2);

                let moreFields = new RoAssociativeArray([
                    { name: new BrsString("field1"), value: new BrsString("my string") },
                    { name: new BrsString("field2"), value: new Int32(-10) },
                    { name: new BrsString("field3"), value: BrsInvalid.Instance },
                ]);
                result = addFields.call(interpreter, moreFields);
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(3); //Only adds the non duplicated
            });

            it("only adds fields if passed as an associative array", () => {
                let node = new RoSGNode([]);
                let fields = "non associative array";

                let addFields = node.getMethod("addfields");

                let result = addFields.call(interpreter, fields);
                expect(result).toEqual(BrsBoolean.False);
                expect(node.getFields().size).toEqual(0);
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

        describe("removefield", () => {
            it("removes a field from the node", () => {
                let node = new RoSGNode([
                    { name: new BrsString("letter1"), value: new BrsString("a") },
                    { name: new BrsString("letter2"), value: new BrsString("b") },
                    { name: new BrsString("letter3"), value: new BrsString("c") },
                ]);

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
                expect(node.getFields().size).toEqual(1);

                result = removeField.call(interpreter, new BrsString("field1"));
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(0);
            });

            it("doesn't remove a non existing field", () => {
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
                expect(node.getFields().size).toEqual(1);

                result = removeField.call(interpreter, new BrsString("field2"));
                expect(result).toEqual(BrsBoolean.True);
                expect(node.getFields().size).toEqual(1);
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
                expect(node.getFields().size).toEqual(0);
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
                expect(node.getFields().size).toEqual(3);

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
                expect(node.getFields().size).toEqual(2);

                result = getField.call(interpreter, new BrsString("field1"));
                expect(result.value).toEqual(strVal);

                result = getField.call(interpreter, new BrsString("field2"));
                expect(result.value).toEqual(intVal);
            });
        });
    });
});
