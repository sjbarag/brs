const BrsTypes = require("../../lib/brsTypes");
const { RebootSystem } = require("../../lib/stdlib");

describe.only("Callable", () => {
    it("is less than nothing", () => {
        const brsValues = [
            new BrsTypes.Int32(1),
            new BrsTypes.Int64(2),
            new BrsTypes.Float(1.5),
            new BrsTypes.Double(2.5),
            new BrsTypes.BrsString("i'm super valid"),
            BrsTypes.BrsBoolean.False,
            BrsTypes.BrsInvalid.Instance,
            RebootSystem
        ];

        brsValues.forEach(other =>
            expect(RebootSystem.lessThan(other)).toBe(BrsTypes.BrsBoolean.False)
        );
    });

    it("is greater than nothing", () => {
        const brsValues = [
            new BrsTypes.Int32(1),
            new BrsTypes.Int64(2),
            new BrsTypes.Float(1.5),
            new BrsTypes.Double(2.5),
            new BrsTypes.BrsString("i'm super valid"),
            BrsTypes.BrsBoolean.False,
            BrsTypes.BrsInvalid.Instance,
            RebootSystem
        ];

        brsValues.forEach(other =>
            expect(RebootSystem.greaterThan(other)).toBe(BrsTypes.BrsBoolean.False)
        );
    });


    it("is only equal to other identical functions", () => {
        const notEqual = [
            new BrsTypes.Int32(1),
            new BrsTypes.Int64(2),
            new BrsTypes.Float(1.5),
            new BrsTypes.Double(2.5),
            new BrsTypes.BrsString("i'm super valid"),
            BrsTypes.BrsBoolean.False,
            BrsTypes.BrsInvalid.Instance,
        ];

        notEqual.forEach(other =>
            expect(RebootSystem.equalTo(other)).toBe(BrsTypes.BrsBoolean.False)
        );

        expect(RebootSystem.equalTo(RebootSystem)).toBe(BrsTypes.BrsBoolean.True);
    });
});