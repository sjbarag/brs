const BrsTypes = require("../../lib/brsTypes");
const { UCase, LCase } = require("../../lib/stdlib");

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
            LCase
        ];

        brsValues.forEach(other =>
            expect(UCase.lessThan(other)).toBe(BrsTypes.BrsBoolean.False)
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
            LCase
        ];

        brsValues.forEach(other =>
            expect(UCase.greaterThan(other)).toBe(BrsTypes.BrsBoolean.False)
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
            LCase
        ];

        notEqual.forEach(other =>
            expect(UCase.equalTo(other)).toBe(BrsTypes.BrsBoolean.False)
        );

        expect(UCase.equalTo(UCase)).toBe(BrsTypes.BrsBoolean.True);
    });
});