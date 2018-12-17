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

// aliases
const BrsAssociativeArray = AssociativeArray;
const BrsFloat = Float;
const BrsInteger = Int32;
const BrsLongInteger = Int64;
const BrsUninitialized = Uninitialized;

expect.extend({
    toBeBrsFloatCloseTo(actual, expectedFloatStr, sigfigs) {
        expect(actual).toBeInstanceOf(BrsFloat);
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
        expect(actual).toBeInstanceOf(BrsAssociativeArray);
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

    let nullStr = 'null';
    let brsNull = BrsInvalid.Instance;
    let brsBareNull = new BrsString(nullStr);

    let falseStr = 'false';
    let brsFalse = new BrsBoolean(false);
    let brsBareFalse = new BrsString(falseStr);

    let brsEmpty = new BrsString('');

    let strUnquoted = 'ok';
    let strQuoted = `"${strUnquoted}"`;
    let brsUnquoted = new BrsString(strUnquoted);
    let brsQuoted = new BrsString(strQuoted);

    let floatStr = '3.14';
    let brsFloat = BrsFloat.fromString(floatStr);
    let brsBareFloat = new BrsString(floatStr);

    let floatStrPrecise = '3.141592653589793238462643383279502884197169399375';
    let brsFloatClose = BrsFloat.fromString(floatStrPrecise);
    let brsBareFloatClose = new BrsString(floatStrPrecise);

    let integerStr = '2147483647'; // max 32-bit int
    let brsInteger = BrsInteger.fromString(integerStr);
    let brsBareInteger = new BrsString(integerStr);

    let longIntegerStr = '9223372036854775807'; // max 64-bit int
    let brsLongInteger = BrsLongInteger.fromString(longIntegerStr);
    let brsBareLongInteger = new BrsString(longIntegerStr);

    let arrayStr = '['
        + falseStr + ','
        + floatStr + ','
        + integerStr + ','
        + longIntegerStr + ','
        + nullStr + ','
        + strQuoted
        + ']';
    let brsArrayStr = new BrsString(arrayStr);
    let brsArray = new BrsArray([
        brsFalse,
        brsFloat,
        brsInteger,
        brsLongInteger,
        brsNull,
        brsUnquoted
    ]);

    // Alpha-sorted by key
    let associativeArrayStrAsc = '{'
        + '"boolean":' + falseStr + ','
        + '"float":' + floatStr + ','
        + '"integer":' + integerStr + ','
        + '"longInteger":' + longIntegerStr + ','
        + '"null":' + nullStr + ','
        + '"string":' + strQuoted
        + '}';

    // Reverse alpha-sorted by key
    let brsAssociativeArrayDesc = new BrsAssociativeArray([
        { name: new BrsString('string'), value: brsUnquoted },
        { name: new BrsString('null'), value: brsNull },
        { name: new BrsString('longInteger'), value: brsLongInteger },
        { name: new BrsString('integer'), value: brsInteger },
        { name: new BrsString('float'), value: brsFloat },
        { name: new BrsString('boolean'), value: brsFalse }
    ]);

    let brsAssociativeArrayStrAsc = new BrsString(associativeArrayStrAsc);

    describe('FormatJson', () => {
        it('rejects non-convertible types', () => {
            jest.spyOn(console, 'error').mockImplementationOnce((s) => {
                expect(s).toMatch(/BRIGHTSCRIPT: ERROR: FormatJSON: /)
            })
            actual = FormatJson.call(interpreter, BrsUninitialized.Instance);
            expect(actual).toEqual(brsEmpty);
        });

        it('converts BRS invalid to bare null string', () => {
            actual = FormatJson.call(interpreter, BrsInvalid.Instance);
            expect(actual).toEqual(brsBareNull);
        });

        it('converts BRS false to bare false string', () => {
            actual = FormatJson.call(interpreter, BrsBoolean.False);
            expect(actual).toEqual(brsBareFalse);
        });

        it('converts BRS string to bare (quoted) string', () => {
            actual = FormatJson.call(interpreter, brsUnquoted);
            expect(actual).toEqual(brsQuoted);
        });

        it('converts BRS integer to bare integer string', () => {
            actual = FormatJson.call(interpreter, brsInteger);
            expect(actual).toEqual(brsBareInteger);
        });

        it('converts BRS longInteger to bare longInteger string', () => {
            actual = FormatJson.call(interpreter, brsLongInteger);
            expect(actual).toEqual(brsBareLongInteger);
        });

        it('converts BRS float to bare float string, within seven significant digits', () => {
            actual = FormatJson.call(interpreter, brsFloatClose);
            expect(actual).toBeBrsFloatStrCloseTo(
                floatStrPrecise,
                BrsFloat.IEEE_FLOAT_SIGFIGS
            );
        });

        it('converts from BRS array', () => {
            actual = FormatJson.call(interpreter, brsArray);
            expect(actual).toEqual(brsArrayStr);
        });

        it('converts from BRS associative array', () => {
            actual = FormatJson.call(interpreter, brsAssociativeArrayDesc);
            expect(actual).toEqual(brsAssociativeArrayStrAsc);
        });
    });

    describe('ParseJson', () => {
        it('rejects empty strings', () => {
            jest.spyOn(console, 'error').mockImplementationOnce((s) => {
                expect(s).toMatch(/BRIGHTSCRIPT: ERROR: ParseJSON: /)
            })
            actual = ParseJson.call(interpreter, brsEmpty);
            expect(actual).toBe(BrsInvalid.Instance);
        });

        it('converts bare null string to BRS invalid', () => {
            actual = ParseJson.call(interpreter, brsBareNull);
            expect(actual).toBe(BrsInvalid.Instance);
        });

        it('converts bare false string to BRS false', () => {
            actual = ParseJson.call(interpreter, brsBareFalse);
            expect(actual).toBe(BrsBoolean.False);
        });

        it('converts bare (quoted) string to BRS string', () => {
            actual = ParseJson.call(interpreter, brsQuoted);
            expect(actual).toEqual(brsUnquoted);
        });

        it('converts bare integer string to BRS integer', () => {
            actual = ParseJson.call(interpreter, brsBareInteger);
            expect(actual).toEqual(brsInteger);
        });

        it('converts bare longInteger string to BRS longInteger', () => {
            actual = ParseJson.call(interpreter, brsBareLongInteger);
            expect(actual).toEqual(brsLongInteger);
        });

        it('converts bare float string to BRS float, within seven significant digits', () => {
            actual = ParseJson.call(interpreter, brsBareFloatClose);
            expect(actual).toBeBrsFloatCloseTo(
                floatStrPrecise,
                BrsFloat.IEEE_FLOAT_SIGFIGS
            );
        });

        it('converts to BRS array', () => {
            actual = ParseJson.call(interpreter, brsArrayStr);
            expect(actual).toEqualBrsArray(brsArray);
        });

        it('converts to BRS associative array', () => {
            actual = ParseJson.call(interpreter, brsAssociativeArrayStrAsc);
            expect(actual).toEqualBrsAssociativeArray(brsAssociativeArrayDesc);
        });
    });
});
