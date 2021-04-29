const { types } = require("../../lib");
const {
    tryCoerce,
    ValueKind,
    Int32,
    Int64,
    Float,
    Double,
    BrsBoolean,
    BrsInvalid,
    RoAssociativeArray,
    RoSGNode,
    BrsString,
    Uninitialized,
} = types;

describe("type coercion", () => {
    describe("tryCoerce", () => {
        it("returns input for dynamic target type", () => {
            let inputs = [
                new Int32(1234),
                new Float(2.345),
                new Double(3.456),
                new Int64(4567),
                new BrsString("lorem"),
                BrsBoolean.False,
                BrsInvalid.Instance,
                new RoAssociativeArray([]),
                new RoSGNode([]),
            ];

            inputs.forEach((input) => {
                expect(input).toBeDefined();
                expect(tryCoerce(input, ValueKind.Dynamic)).toBe(input);
            });
        });

        it.each([
            ["integer", new Int32(1234), ValueKind.Int32],
            ["float", new Float(2.345), ValueKind.Float],
            ["double", new Double(3.456), ValueKind.Double],
            ["longinteger", new Int64(4567), ValueKind.Int64],
            ["string", new BrsString("lorem"), ValueKind.String],
            ["boolean", BrsBoolean.False, ValueKind.Boolean],
            ["invalid", BrsInvalid.Instance, ValueKind.Invalid],
        ])("returns input for %s target", (_type, input, target) => {
            expect(input).toBeDefined();
            expect(tryCoerce(input, target)).toBe(input);
        });

        it("returns uninitialized for any target type", () => {
            expect(tryCoerce(Uninitialized.Instance, ValueKind.String)).toBe(
                Uninitialized.Instance
            );
        });

        describe("boxing", () => {
            it.each([
                ["integer", new Int32(1234), types.roInt],
                ["float", new Float(2.345), types.roFloat],
                ["double", new Double(3.456), types.roDouble],
                ["string", new String("lorem"), types.roString],
            ])("boxes %s for object target", (_type, input, ctor) => {
                let output = tryCoerce(input, ValueKind.Object);
                expect(output).toBeInstanceOf(ctor);
                expect(output.unbox()).toEqual(input);
            });
        });

        describe("boxing", () => {
            it.each([
                ["integer", new Int32(1234), types.roInt],
                ["float", new Float(2.345), types.roFloat],
                ["double", new Double(3.456), types.roDouble],
                ["longinteger", new Int64(3.456), types.roLongInteger],
                ["string", new BrsString("lorem"), types.roString],
                ["boolean", BrsBoolean.False, types.roBoolean],
            ])("boxes %s for object target", (_type, input, ctor) => {
                let output = tryCoerce(input, ValueKind.Object);
                expect(output).toBeInstanceOf(ctor);
                expect(output.unbox()).toEqual(input);
            });
        });

        describe("numeric conversions", () => {
            it.each([
                // pairs of [type, input, coerced_value]
                ["float", new Float(3.14159), new Int32(3)],
                ["double", new Double(2.71828), new Int32(2)],
                ["longinteger", new Int64(2147483647119), new Int32(-881)],
            ])("returns integer for %s target", (_type, input, output) => {
                expect(tryCoerce(input, ValueKind.Int32)).toEqual(output);
            });

            it.each([
                // pairs of [type, input, coerced_value]
                ["integer", new Int32(-5), new Float(-5)],
                ["double", new Double(2.71828), new Float(2.71828)],
                ["longinteger", new Int64(2147483647119), new Float(2147483647119)],
            ])("returns float for %s target", (_type, input, output) => {
                expect(tryCoerce(input, ValueKind.Float)).toEqual(output);
            });

            it.each([
                // pairs of [type, input, coerced_value]
                ["integer", new Int32(-5), new Double(-5)],
                ["float", new Float(3.14159), new Double(3.14159)],
                ["longinteger", new Int64(2147483647119), new Double(2147483647119)],
            ])("returns double for %s target", (_type, input, output) => {
                expect(tryCoerce(input, ValueKind.Double)).toEqual(output);
            });

            it.each([
                // pairs of [type, input, coerced_value]
                ["integer", new Int32(-5), new Int64(-5)],
                ["float", new Float(3.14159), new Int64(3)],
                ["double", new Double(2.71828), new Int64(2)],
            ])("returns longinteger for %s target", (_type, input, output) => {
                expect(tryCoerce(input, ValueKind.Int64)).toEqual(output);
            });
        });
    });
});
