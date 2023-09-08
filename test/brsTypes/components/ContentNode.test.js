const brs = require("../../../lib");
const { ContentNode, BrsString, RoAssociativeArray } = brs.types;
const { Interpreter } = require("../../../lib/interpreter");

describe("ContentNode.js", () => {
    describe("stringification", () => {
        it("inits a new ContentNode component", () => {
            let node = new ContentNode();

            expect(node.toString()).toEqual(
                `<Component: roSGNode:ContentNode> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: ""
}`
            );
        });
    });

    describe("hidden fields", () => {
        let interpreter;
        beforeAll(() => {
            interpreter = new Interpreter();
        });

        describe("are initially hidden from", () => {
            it("'count'", () => {
                let node = new ContentNode();
                let func = node.getMethod("count");
                let result = func.call(interpreter);

                expect(result.value).toEqual(4);
            });

            it("'keys'", () => {
                let node = new ContentNode();
                let func = node.getMethod("keys");
                let result = func.call(interpreter);

                expect(result.getElements().length).toEqual(4);
            });

            it("'items'", () => {
                let node = new ContentNode();
                let func = node.getMethod("items");
                let result = func.call(interpreter);

                expect(result.getElements().length).toEqual(4);
            });
        });

        describe("can be accessed from", () => {
            it("'getField'", () => {
                let node = new ContentNode();
                let func = node.getMethod("getField");
                let result = func.call(interpreter, new BrsString("description"));

                expect(result.value).toEqual("");
            });

            it("'hasField'", () => {
                let node = new ContentNode();
                let func = node.getMethod("hasField");
                let result = func.call(interpreter, new BrsString("description"));

                expect(result.value).toEqual(true);
            });

            it("'setField'", () => {
                let node = new ContentNode();
                let func = node.getMethod("setField");
                let result = func.call(
                    interpreter,
                    new BrsString("description"),
                    new BrsString("new value")
                );

                expect(result.value).toEqual(true);

                let getField = node.getMethod("getField");
                let fieldVal = getField.call(interpreter, new BrsString("description"));

                expect(fieldVal.value).toEqual("new value");
            });

            it("'update'", () => {
                let node = new ContentNode();
                let func = node.getMethod("update");
                let result = func.call(
                    interpreter,
                    new RoAssociativeArray([
                        { name: new BrsString("description"), value: new BrsString("new value") },
                    ])
                );

                let getField = node.getMethod("getField");
                let fieldVal = getField.call(interpreter, new BrsString("description"));

                expect(fieldVal.value).toEqual("new value");
            });

            it("'doesExist'", () => {
                let node = new ContentNode();
                let func = node.getMethod("doesExist");
                let result = func.call(interpreter, new BrsString("description"));

                expect(result.value).toEqual(true);
            });

            it("'lookup'", () => {
                let node = new ContentNode();
                let func = node.getMethod("lookup");
                let result = func.call(interpreter, new BrsString("description"));

                expect(result.value).toEqual("");
            });
        });

        describe("are treated like normal fields after being accessed from", () => {
            function validateOtherMemberFuncs(node) {
                let count = node.getMethod("count");
                let countResult = count.call(interpreter);
                expect(countResult.value).toEqual(5);

                let keys = node.getMethod("keys");
                let keysResult = keys.call(interpreter);
                expect(keysResult.getElements().length).toEqual(5);

                let items = node.getMethod("items");
                let itemsResult = items.call(interpreter);
                expect(itemsResult.getElements().length).toEqual(5);
            }

            it("'getField'", () => {
                let node = new ContentNode();
                let func = node.getMethod("getField");
                let result = func.call(interpreter, new BrsString("description"));

                validateOtherMemberFuncs(node);
                expect(node.toString()).toEqual(
                    `<Component: roSGNode:ContentNode> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: ""
    DESCRIPTION: ""
}`
                );
            });

            it("'hasField'", () => {
                let node = new ContentNode();
                let func = node.getMethod("hasField");
                let result = func.call(interpreter, new BrsString("description"));

                validateOtherMemberFuncs(node);
                expect(node.toString()).toEqual(
                    `<Component: roSGNode:ContentNode> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: ""
    DESCRIPTION: ""
}`
                );
            });

            it("'setField'", () => {
                let node = new ContentNode();
                let func = node.getMethod("setField");
                let result = func.call(
                    interpreter,
                    new BrsString("description"),
                    new BrsString("new value")
                );

                validateOtherMemberFuncs(node);
                expect(node.toString()).toEqual(
                    `<Component: roSGNode:ContentNode> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: ""
    DESCRIPTION: "new value"
}`
                );
            });

            it("'update'", () => {
                let node = new ContentNode();
                let func = node.getMethod("update");
                let result = func.call(
                    interpreter,
                    new RoAssociativeArray([
                        { name: new BrsString("description"), value: new BrsString("new value") },
                    ])
                );

                validateOtherMemberFuncs(node);
                expect(node.toString()).toEqual(
                    `<Component: roSGNode:ContentNode> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: ""
    DESCRIPTION: "new value"
}`
                );
            });

            it("'doesExist'", () => {
                let node = new ContentNode();
                let func = node.getMethod("doesExist");
                let result = func.call(interpreter, new BrsString("description"));

                validateOtherMemberFuncs(node);
                expect(node.toString()).toEqual(
                    `<Component: roSGNode:ContentNode> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: ""
    DESCRIPTION: ""
}`
                );
            });

            it("'lookup'", () => {
                let node = new ContentNode();
                let func = node.getMethod("lookup");
                let result = func.call(interpreter, new BrsString("description"));

                validateOtherMemberFuncs(node);
                expect(node.toString()).toEqual(
                    `<Component: roSGNode:ContentNode> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: ""
    DESCRIPTION: ""
}`
                );
            });
        });
    });
});
