const brs = require("brs");
const { RoSGNode, BrsInvalid } = brs.types;
const { Interpreter } = require("../../../lib/interpreter");

describe("RoSGNode", () => {
    describe("it can be created", () => {
        it("creates a simple Node", () => {
            let node = new RoSGNode();
            expect(node.toString()).toEqual("<Component: roSGNode>");
        });
    });
});
