const BrsTypes = require("../../lib/brsTypes");
const { UCase, LCase } = require("../../lib/stdlib");
const { Interpreter } = require("../../lib/interpreter");

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
            LCase,
        ];

        brsValues.forEach(other => expect(UCase.lessThan(other)).toBe(BrsTypes.BrsBoolean.False));
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
            LCase,
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
            LCase,
        ];

        notEqual.forEach(other => expect(UCase.equalTo(other)).toBe(BrsTypes.BrsBoolean.False));

        expect(UCase.equalTo(UCase)).toBe(BrsTypes.BrsBoolean.True);
    });

    describe("type checking", () => {
        it("detects calls with too few arguments", () => {
            const hasArgs = new BrsTypes.Callable("acceptsArgs", {
                signature: {
                    args: [new BrsTypes.StdlibArgument("foo", BrsTypes.ValueKind.String)],
                    returns: BrsTypes.String,
                },
                impl: () => {},
            });

            expect(
                hasArgs.getAllSignatureMismatches([]).map(mm => mm.mismatches)[0]
            ).toContainEqual({
                reason: BrsTypes.MismatchReason.TooFewArguments,
                expected: "1",
                received: "0",
            });
        });

        it("detects calls with too many arguments", () => {
            const noArgs = new BrsTypes.Callable("acceptsArgs", {
                signature: {
                    args: [],
                    returns: BrsTypes.String,
                },
                impl: () => {},
            });

            expect(
                noArgs
                    .getAllSignatureMismatches([new BrsTypes.BrsString("foo")])
                    .map(mm => mm.mismatches)[0]
            ).toContainEqual({
                reason: BrsTypes.MismatchReason.TooManyArguments,
                expected: "0",
                received: "1",
            });
        });

        it("allows optional arguments to be excluded", () => {
            const hasArgs = new BrsTypes.Callable("acceptsOptionalArgs", {
                signature: {
                    args: [
                        new BrsTypes.StdlibArgument(
                            "foo",
                            BrsTypes.ValueKind.String,
                            new BrsTypes.BrsString("defaultFoo")
                        ),
                    ],
                    returns: BrsTypes.String,
                },
                impl: () => {},
            });

            expect(hasArgs.getAllSignatureMismatches([]).map(mm => mm.mismatches)[0]).toEqual([]);
        });

        it("detects argument mismatches", () => {
            const hasArgs = new BrsTypes.Callable("acceptsString", {
                signature: {
                    args: [new BrsTypes.StdlibArgument("foo", BrsTypes.ValueKind.String)],
                    returns: BrsTypes.ValueKind.String,
                },
                impl: () => {},
            });

            expect(
                hasArgs
                    .getAllSignatureMismatches([BrsTypes.BrsBoolean.False])
                    .map(mm => mm.mismatches)[0]
            ).toContainEqual({
                reason: BrsTypes.MismatchReason.ArgumentTypeMismatch,
                expected: "String",
                received: "Boolean",
                argName: "foo",
            });
        });

        it("allows float to be passed to an integer argument", () => {
            const hasArgs = new BrsTypes.Callable("acceptsAnything", {
                signature: {
                    args: [new BrsTypes.StdlibArgument("intArg", BrsTypes.ValueKind.Int32)],
                    returns: BrsTypes.ValueKind.String,
                },
                impl: () => {},
            });

            expect(
                hasArgs
                    .getAllSignatureMismatches([new BrsTypes.Float(1.5)])
                    .map(mm => mm.mismatches)[0]
            ).toEqual([]);
        });

        it("allows integer to be passed to a float argument", () => {
            const hasArgs = new BrsTypes.Callable("acceptsAnything", {
                signature: {
                    args: [new BrsTypes.StdlibArgument("floatArg", BrsTypes.ValueKind.Float)],
                    returns: BrsTypes.ValueKind.String,
                },
                impl: () => {},
            });

            expect(
                hasArgs
                    .getAllSignatureMismatches([new BrsTypes.Int32(4)])
                    .map(mm => mm.mismatches)[0]
            ).toEqual([]);
        });

        it("allows any type for dynamic", () => {
            const hasArgs = new BrsTypes.Callable("acceptsAnything", {
                signature: {
                    args: [new BrsTypes.StdlibArgument("foo", BrsTypes.ValueKind.Dynamic)],
                    returns: BrsTypes.ValueKind.String,
                },
                impl: () => {},
            });

            expect(
                hasArgs
                    .getAllSignatureMismatches([BrsTypes.BrsBoolean.False])
                    .map(mm => mm.mismatches)[0]
            ).toEqual([]);
        });

        it("automatically boxes primitive arguments when signature requests boxed version", () => {
            const hasArgs = new BrsTypes.Callable("acceptsObject", {
                signature: {
                    args: [new BrsTypes.StdlibArgument("foo", BrsTypes.ValueKind.Object)],
                    returns: BrsTypes.ValueKind.Object,
                },
            });

            let satisfied = hasArgs.getFirstSatisfiedSignature([
                new BrsTypes.BrsString("a primitive string"),
            ]);
            expect(satisfied.correctedArgs.length).toBe(1);
            expect(satisfied.correctedArgs[0]).toBeInstanceOf(BrsTypes.RoString);
        });

        it("automatically unboxes boxed arguments when signature requests primitive version", () => {
            const hasArgs = new BrsTypes.Callable("acceptsObject", {
                signature: {
                    args: [new BrsTypes.StdlibArgument("foo", BrsTypes.ValueKind.String)],
                    returns: BrsTypes.ValueKind.Object,
                },
            });

            let satisfied = hasArgs.getFirstSatisfiedSignature([
                new BrsTypes.BrsString("a boxed string").box(),
            ]);
            expect(satisfied.correctedArgs.length).toBe(1);
            expect(satisfied.correctedArgs[0]).toBeInstanceOf(BrsTypes.BrsString);
        });

        it("automatically boxes return values when implementation returns primitive version", () => {
            const hasArgs = new BrsTypes.Callable("returnsObject", {
                signature: {
                    args: [],
                    returns: BrsTypes.ValueKind.Object,
                },
                impl: () => new BrsTypes.Float(3.14),
            });

            let result = hasArgs.call(new Interpreter());
            expect(result).toBeInstanceOf(BrsTypes.roFloat);
            expect(result.unbox()).toEqual(new BrsTypes.Float(3.14));
        });

        it("automatically unboxes return values when implementation returns boxed version", () => {
            const hasArgs = new BrsTypes.Callable("returnsObject", {
                signature: {
                    args: [],
                    returns: BrsTypes.ValueKind.Int32,
                },
                impl: () => new BrsTypes.roInt(new BrsTypes.Int32(200)),
            });

            let result = hasArgs.call(new Interpreter());
            expect(result).toBeInstanceOf(BrsTypes.Int32);
            expect(result).toEqual(new BrsTypes.Int32(200));
        });
    });
});
