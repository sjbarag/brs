const brs = require("brs");
const {
    RoDeviceInfo,
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

describe("RoDeviceInfo", () => {
    describe("comparisons", () => {
        it("is equal to nothing", () => {
            let a = new RoDeviceInfo();
            expect(a.equalTo(a)).toBe(BrsBoolean.False);
        });
    });

    describe("stringification", () => {
        it("lists stringified value", () => {
            let deviceInfo = new RoDeviceInfo();
            expect(deviceInfo.toString()).toEqual(`<Component: roDeviceInfo>`);
        });
    });
});
