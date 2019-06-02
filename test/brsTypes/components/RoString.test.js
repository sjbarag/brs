const brs = require("brs");
const { BrsString, RoString, BrsBoolean } = brs.types;

describe("RoString", () => {
    describe("equality", () => {
        it("compares to intrinsic strings", () => {
            let a = new RoString(new BrsString("foo"));
            let b = new BrsString("foo");
            let c = new BrsString("bar");

            expect(a.equalTo(b)).toBe(BrsBoolean.True);
            expect(a.equalTo(c)).toBe(BrsBoolean.False);
        });

        it("compares to boxed strings", () => {
            let a = new RoString(new BrsString("foo"));
            let b = new RoString(new BrsString("foo"));
            let c = new RoString(new BrsString("bar"));

            expect(a.equalTo(b)).toBe(BrsBoolean.True);
            expect(a.equalTo(c)).toBe(BrsBoolean.False);
        });
    });

    // describe("ifStringOps", () => {
    // });
});
