const { Interpreter } = require('../../lib/interpreter');
const { FormatJson, ParseJson } = require("../../lib/stdlib/index");
const { BrsArray } = require("../../lib/brsTypes/components/BrsArray");
const { AssociativeArray } = require("../../lib/brsTypes/components/AssociativeArray");
const {
    BrsBoolean,
    BrsInvalid,
    BrsString,
    Float,
    Int32,
    Int64,
    Uninitialized
} = require("../../lib/brsTypes");

expect.extend({
    toBeBrsFloatCloseTo(actual, expectedFloatStr, sigfigs) {
        expect(actual).toBeInstanceOf(Float);
        expectedFloat = Number.parseFloat(expectedFloatStr);
        expect(actual.getValue()).toBeCloseTo(expectedFloat, sigfigs);
        return { pass: true };
    },
    toBeBrsFloatStrCloseTo(actual, expectedFloatStr, sigfigs) {
        expect(actual).toBeInstanceOf(BrsString);
        actualFloat = Number.parseFloat(actual.toString());
        expectedFloat = Number.parseFloat(expectedFloatStr);
        expect(actualFloat).toBeCloseTo(expectedFloat, sigfigs);
        return { pass: true };
    },
    toEqualBrsArray(actual, expected) {
        expect(actual).toBeInstanceOf(BrsArray);
        expect(actual.getElements()).toEqual(expected.getElements());
        return { pass: true };
    },
    toEqualBrsAssociativeArray(actual, expected) {
        expect(actual).toBeInstanceOf(AssociativeArray);
        actualKeys = actual.getElements();
        expectedKeys = expected.getElements();
        expect(actualKeys).toEqual(expectedKeys);
        actualKeys.forEach((key) => {
            expect(actual.get(key)).toEqual(expected.get(key));
        });
        return { pass: true };
    }
});

describe('global JSON functions', () => {
    let interpreter = new Interpreter();

    describe('FormatJson', () => {
        it('rejects non-convertible types', () => {
            jest.spyOn(console, 'error').mockImplementationOnce((s) => {
                expect(s).toMatch(/BRIGHTSCRIPT: ERROR: FormatJSON: /)
            })
            expect(FormatJson.call(interpreter, Uninitialized.Instance)).toEqual(new BrsString(''));
        });

        it('converts BRS invalid to bare null string', () => {
            expect(FormatJson.call(interpreter, BrsInvalid.Instance)).toEqual(new BrsString('null'));
        });

        it('converts BRS false to bare false string', () => {
            expect(FormatJson.call(interpreter, BrsBoolean.False)).toEqual(new BrsString('false'));
        });

        it('converts BRS string to bare (quoted) string', () => {
            expect(FormatJson.call(interpreter, new BrsString('ok'))).toEqual(new BrsString(`"ok"`));
        });

        it('converts BRS integer to bare integer string', () => {
            expect(FormatJson.call(interpreter, Int32.fromString('2147483647'))).toEqual(new BrsString('2147483647'));
        });

        it('converts BRS longInteger to bare longInteger string', () => {
            expect(FormatJson.call(interpreter, Int64.fromString('9223372036854775807'))).toEqual(new BrsString('9223372036854775807'));
        });

        it('converts BRS float to bare float string, within seven significant digits', () => {
            expect(FormatJson.call(interpreter, Float.fromString('3.141592653589793238462643383279502884197169399375'))).toBeBrsFloatStrCloseTo('3.141592653589793238462643383279502884197169399375', Float.IEEE_FLOAT_SIGFIGS );
        });

        it('converts from BRS array', () => {
            let brsArray = new BrsArray([
                new BrsBoolean(false),
                Float.fromString('3.14'),
                Int32.fromString('2147483647'),
                Int64.fromString('9223372036854775807'),
                BrsInvalid.Instance,
                new BrsString('ok')
            ]);
            expect(FormatJson.call(interpreter, brsArray)).toEqual(new BrsString(`[false,3.14,2147483647,9223372036854775807,null,"ok"]`));
        });

        it('converts from BRS associative array to key-sorted JSON string', () => {
            let brsAssociativeArrayDesc = new AssociativeArray([
                { name: new BrsString('string'), value: new BrsString('ok') },
                { name: new BrsString('null'), value: BrsInvalid.Instance },
                { name: new BrsString('longInteger'), value: Int64.fromString('9223372036854775807') },
                { name: new BrsString('integer'), value: Int32.fromString('2147483647') },
                { name: new BrsString('float'), value: Float.fromString('3.14') },
                { name: new BrsString('boolean'), value: new BrsBoolean(false) }
            ]);
            let brsAssociativeArrayStrAsc = new BrsString(`{"boolean":false,"float":3.14,"integer":2147483647,"longInteger":9223372036854775807,"null":null,"string":"ok"}`);
            expect(FormatJson.call(interpreter, brsAssociativeArrayDesc)).toEqual(brsAssociativeArrayStrAsc);
        });
    });

    describe('ParseJson', () => {
        it('rejects empty strings', () => {
            jest.spyOn(console, 'error').mockImplementationOnce((s) => {
                expect(s).toMatch(/BRIGHTSCRIPT: ERROR: ParseJSON: /)
            })
            expect(ParseJson.call(interpreter, new BrsString(''))).toBe(BrsInvalid.Instance);
        });

        it('converts bare null string to BRS invalid', () => {
            expect(ParseJson.call(interpreter, new BrsString('null'))).toBe(BrsInvalid.Instance);
        });

        it('converts bare false string to BRS false', () => {
            expect(ParseJson.call(interpreter, new BrsString('false'))).toBe(BrsBoolean.False);
        });

        it('converts bare (quoted) string to BRS string', () => {
            expect(ParseJson.call(interpreter, new BrsString(`"ok"`))).toEqual(new BrsString('ok'));
        });

        it('converts bare integer string to BRS integer', () => {
            expect(ParseJson.call(interpreter, new BrsString('2147483647'))).toEqual(Int32.fromString('2147483647'));
        });

        it('converts bare longInteger string to BRS longInteger', () => {
            expect(ParseJson.call(interpreter, new BrsString('9223372036854775807'))).toEqual(Int64.fromString('9223372036854775807'));
        });

        it('converts bare float string to BRS float, within seven significant digits', () => {
            expect(ParseJson.call(interpreter, new BrsString('3.141592653589793238462643383279502884197169399375'))).toBeBrsFloatCloseTo('3.141592653589793238462643383279502884197169399375', Float.IEEE_FLOAT_SIGFIGS);
        });

        it('converts to BRS array', () => {
            let brsArray = new BrsArray([
                new BrsBoolean(false),
                Float.fromString('3.14'),
                Int32.fromString('2147483647'),
                Int64.fromString('9223372036854775807'),
                BrsInvalid.Instance,
                new BrsString('ok')
            ]);
            expect(ParseJson.call(interpreter, new BrsString(`[false,3.14,2147483647,9223372036854775807,null,"ok"]`))).toEqualBrsArray(brsArray);
        });

        it('converts to BRS associative array', () => {
            let brsAssociativeArrayDesc = new AssociativeArray([
                { name: new BrsString('string'), value: new BrsString('ok') },
                { name: new BrsString('null'), value: BrsInvalid.Instance },
                { name: new BrsString('longInteger'), value: Int64.fromString('9223372036854775807') },
                { name: new BrsString('integer'), value: Int32.fromString('2147483647') },
                { name: new BrsString('float'), value: Float.fromString('3.14') },
                { name: new BrsString('boolean'), value: new BrsBoolean(false) }
            ]);
            let brsAssociativeArrayStrAsc = new BrsString(`{"boolean":false,"float":3.14,"integer":2147483647,"longInteger":9223372036854775807,"null":null,"string":"ok"}`);
            expect(ParseJson.call(interpreter, brsAssociativeArrayStrAsc)).toEqualBrsAssociativeArray(brsAssociativeArrayDesc);
        });
    });
});
