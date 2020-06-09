const brs = require("brs");
const { RoSGNode, Field, RoSGNodeEvent, BrsString } = brs.types;
const { Interpreter } = require("../../../lib/interpreter");

describe("RoSGNodeEvent", () => {
    let interpreter = new Interpreter();
    let nodeId = new BrsString("node-id");
    let node = new RoSGNode([{
        name: new BrsString("id"),
        value: nodeId
    }]);
    let fieldName = new BrsString("fieldName");
    let fieldValue = new BrsString("fieldValue");
    let field = new Field(fieldValue, false);

    describe("stringification", () => {
        it("prints out correctly", () => {
            let event = new RoSGNodeEvent(node, fieldName, field);
            expect(event.toString()).toEqual(`<Component: roSGNodeEvent>`);
        });
    });

    describe("getdata", () => {
        it("returns the field value", () => {
            let event = new RoSGNodeEvent(node, fieldName, field);
            let getData = event.getMethod("getdata");

            expect(getData.call(interpreter)).toEqual(fieldValue);
        });
    });

    describe("getfield", () => {
        it("returns the field name", () => {
            let event = new RoSGNodeEvent(node, fieldName, field);
            let getField = event.getMethod("getfield");

            expect(getField.call(interpreter)).toEqual(fieldName);
        });
    });

    describe("getrosgnode", () => {
        it("returns a pointer to the node", () => {
            let event = new RoSGNodeEvent(node, fieldName, field);
            let getRosgnode = event.getMethod("getrosgnode");

            expect(getRosgnode.call(interpreter)).toEqual(node);
        });
    });

    describe("getnode", () => {
        it("returns the node id", () => {
            let event = new RoSGNodeEvent(node, fieldName, field);
            let getNode = event.getMethod("getnode");

            expect(getNode.call(interpreter)).toEqual(nodeId);
        });
    });
});
