const { Interpreter } = require('../../lib/interpreter');
const { FormatJson, ParseJson } = require("../../lib/stdlib/index");
const { BrsArray } = require("../../lib/brsTypes/components/BrsArray");
const {
    BrsBoolean,
    BrsInvalid,
    BrsString,
    Float,
    Int32,
    Int64,
    Uninitialized,
    ValueKind
} = require("../../lib/brsTypes");

expect.extend({
    toMatchBrsArray(actual, expected) {
        expect(actual).toBeInstanceOf(BrsArray);
        expect(actual.getElements()).toMatchObject(expected.getElements());
        return { pass: true };
    },
    toBeFloatStrCloseTo(actual, expected, sigfigs) {
        actualFloat = Number.parseFloat(actual);
        expectedFloat = Number.parseFloat(expected);
        expect(actualFloat).toBeCloseTo(expectedFloat, sigfigs);
        return { pass: true };
    },
    toBeBrsFloatCloseTo(actual, floatStr, sigfigs = Float.IEEE_FLOAT_SIGFIGS) {
        expect(actual).toBeInstanceOf(Float);
        expect(actual.value).toBeFloatStrCloseTo(floatStr, sigfigs);
        return { pass: true };
    },
    toBeBrsBareFloatCloseTo(actual, floatStr, sigfigs = Float.IEEE_FLOAT_SIGFIGS) {
        expect(actual).toBeInstanceOf(BrsString);
        expect(actual.value).toBeFloatStrCloseTo(floatStr, sigfigs);
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

    let floatStr = '3.14159265358979323846264338327950288419716939937510';
    let brsFloat = Float.fromString(floatStr);
    let brsBareFloat = new BrsString(floatStr);

    let integerStr = '2147483647'; // max 32-bit int
    let brsInteger = Int32.fromString(integerStr);
    let brsBareInteger = new BrsString(integerStr);

    let longIntegerStr = '9223372036854775807'; // max 64-bit int
    let brsLongInteger = Int64.fromString(longIntegerStr);
    let brsBareLongInteger = new BrsString(longIntegerStr);

    // Don't include floats for now
    let array = [nullStr, falseStr, strQuoted, integerStr, longIntegerStr];
    let arrayStr = `[${array.join(',')}]`;
    let brsArrayStr = new BrsString(arrayStr);
    let brsArray = new BrsArray([
        brsNull,
        brsFalse,
        brsUnquoted,
        brsInteger,
        brsLongInteger
    ]);

    describe('FormatJson', () => {
        it('rejects non-convertible types', () => {
            jest.spyOn(console, 'error').mockImplementationOnce((s) => {
                expect(s).toMatch(/BRIGHTSCRIPT: ERROR: FormatJSON: /)
            })
            actual = FormatJson.call(interpreter, Uninitialized.Instance);
            expect(actual).toMatchObject(brsEmpty);
        });

        it('converts BRS invalid to bare null string', () => {
            actual = FormatJson.call(interpreter, BrsInvalid.Instance);
            expect(actual).toMatchObject(brsBareNull);
        });

        it('converts BRS false to bare false string', () => {
            actual = FormatJson.call(interpreter, BrsBoolean.False);
            expect(actual).toMatchObject(brsBareFalse);
        });

        it('converts BRS string to bare (quoted) string', () => {
            actual = FormatJson.call(interpreter, brsUnquoted);
            expect(actual).toMatchObject(brsQuoted);
        });

        it('converts BRS integer to bare integer string', () => {
            actual = FormatJson.call(interpreter, brsInteger);
            expect(actual).toMatchObject(brsBareInteger);
        });

        it('converts BRS longInteger to bare longInteger string', () => {
            actual = FormatJson.call(interpreter, brsLongInteger);
            expect(actual).toMatchObject(brsBareLongInteger);
        });

        it('converts BRS float to bare float string', () => {
            actual = FormatJson.call(interpreter, brsFloat);
            expect(actual).toBeBrsBareFloatCloseTo(floatStr);
        });

        it('converts from BRS array', () => {
            actual = FormatJson.call(interpreter, brsArray);
            expect(actual).toEqual(brsArrayStr);
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
            expect(actual).toMatchObject(brsUnquoted);
        });

        it('converts bare integer string to BRS integer', () => {
            actual = ParseJson.call(interpreter, brsBareInteger);
            expect(actual).toMatchObject(brsInteger);
        });

        it('converts bare longInteger string to BRS longInteger', () => {
            actual = ParseJson.call(interpreter, brsBareLongInteger);
            expect(actual).toMatchObject(brsLongInteger);
        });

        it('converts bare float string to BRS float', () => {
            actual = ParseJson.call(interpreter, brsBareFloat);
            expect(actual).toBeBrsFloatCloseTo(floatStr);
        });

        xit('converts to BRS array', () => {
            actual = ParseJson.call(interpreter, brsArrayStr);
            expect(actual).toMatchBrsArray(brsArray);
        });
    });
});
