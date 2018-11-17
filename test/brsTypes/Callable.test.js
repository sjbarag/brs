const BrsTypes = require("../../lib/brsTypes");
const { UCase, LCase } = require("../../lib/stdlib");

describe("Callable", () => {
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

    describe("arity", () => {
        it("allows no-args functions", () => {
            const noArgs = new BrsTypes.Callable(
                "acceptsNoArgs",
                {
                    args: []
                },
                () => {}
            );
            expect(noArgs.arity).toEqual({
                required: 0,
                optional: 0
            });
        });

        it("allows functions with only required args", () => {
            const required = new BrsTypes.Callable(
                "requiredOnly",
                {
                    args: [
                        { name: "foo", type: BrsTypes.ValueKind.String },
                        { name: "bar", type: BrsTypes.ValueKind.Int32 },
                    ]
                }
            );
            expect(required.arity).toEqual({
                required: 2,
                optional: 0
            });
        });

        it("allows functions with only optional args", () => {
            const required = new BrsTypes.Callable(
                "optionalOnly",
                {
                    args: [
                        { name: "foo", type: BrsTypes.ValueKind.String, defaultValue: new BrsTypes.BrsString("okay") },
                        { name: "bar", type: BrsTypes.ValueKind.Int32, defaultValue: new BrsTypes.Int32(-1) },
                    ]
                }
            );
            expect(required.arity).toEqual({
                required: 0,
                optional: 2
            });
        });

        it("allows functions with both required and optional args", () => {
            const required = new BrsTypes.Callable(
                "requiredAndOptional",
                {
                    args: [
                        { name: "foo", type: BrsTypes.ValueKind.String },
                        { name: "bar", type: BrsTypes.ValueKind.Int32, defaultValue: new BrsTypes.Int32(-1) },
                    ]
                }
            );
            expect(required.arity).toEqual({
                required: 1,
                optional: 1
            });
        });
    });
});