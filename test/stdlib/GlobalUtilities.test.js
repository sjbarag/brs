const brs = require("brs");
const { RoAssociativeArray, BrsString, BrsInvalid, BrsInterface, RoSGNode } = brs.types;
const { GetInterface, FindMemberFunction } = require("../../lib/stdlib");
const { Interpreter } = require("../../lib/interpreter");

describe("global utility functions", () => {
    let interpreter = new Interpreter();

    describe("GetInterface", () => {
        it("returns invalid for unimplemented interfaces", () => {
            let assocarray = new RoAssociativeArray([]);
            expect(GetInterface.call(interpreter, assocarray, new BrsString("ifArray"))).toBe(
                BrsInvalid.Instance
            );
        });

        it("returns an interface for implemented interfaces", () => {
            let assocarray = new RoAssociativeArray([]);
            let iface = GetInterface.call(
                interpreter,
                assocarray,
                new BrsString("ifAssociativeArray")
            );
            expect(iface).toBeInstanceOf(BrsInterface);
            expect(iface.name).toBe("ifAssociativeArray");
        });
    });

    describe("FindMemberFunction", () => {
        it("returns invalid if method isn't found in any interface", () => {
            let assocarray = new RoAssociativeArray([]);
            expect(
                FindMemberFunction.call(interpreter, assocarray, new BrsString("addField"))
            ).toBe(BrsInvalid.Instance);
        });

        it("addfield exists in ifSGNodeField of RoSGNode", () => {
            let node = new RoSGNode([]);
            let memberFunction = FindMemberFunction.call(
                interpreter,
                node,
                new BrsString("addfield")
            );

            expect(memberFunction).toBeInstanceOf(BrsInterface);
            expect(memberFunction.name).toBe("ifSGNodeField");
        });

        it("findNode exists in ifSGNodeDict of RoSGNode", () => {
            let node = new RoSGNode([]);
            let memberFunction = FindMemberFunction.call(
                interpreter,
                node,
                new BrsString("findNode")
            );

            expect(memberFunction).toBeInstanceOf(BrsInterface);
            expect(memberFunction.name).toBe("ifSGNodeDict");
        });
    });
});
