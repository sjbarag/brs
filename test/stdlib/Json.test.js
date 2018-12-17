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
    toBeBrsFloatCloseTo(actual, expectedFloatStr) {
        expect(actual).toBeInstanceOf(BrsFloat);
        expectedFloat = Number.parseFloat(expectedFloatStr);
        expect(actual.getValue())
            .toBeCloseTo(expectedFloat, BrsFloat.IEEE_FLOAT_SIGFIGS);
        return { pass: true };
    },
    toBeBrsFloatStrCloseTo(actual, expectedFloatStr) {
        expect(actual).toBeInstanceOf(BrsString);
        actualFloat = Number.parseFloat(actual.toString());
        expectedFloat = Number.parseFloat(expectedFloatStr);
        expect(actualFloat)
            .toBeCloseTo(expectedFloat, BrsFloat.IEEE_FLOAT_SIGFIGS);
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

    let floatStr = '3.14159265358979323846264338327950288419716939937510';
    let brsFloat = BrsFloat.fromString(floatStr);
    let brsBareFloat = new BrsString(floatStr);

    let integerStr = '2147483647'; // max 32-bit int
    let brsInteger = BrsInteger.fromString(integerStr);
    let brsBareInteger = new BrsString(integerStr);

    let longIntegerStr = '9223372036854775807'; // max 64-bit int
    let brsLongInteger = BrsLongInteger.fromString(longIntegerStr);
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

    let associativeArrayStr = '{"bool":false,"int":2147483647,"longInt":9223372036854775807,"null":null,"str":"ok"}';
    let brsAssociativeArrayStr = new BrsString(associativeArrayStr);
    let brsAssociativeArray = new BrsAssociativeArray([
        { name: new BrsString('bool'), value: brsFalse },
        { name: new BrsString('int'), value: brsInteger },
        { name: new BrsString('longInt'), value: brsLongInteger },
        { name: new BrsString('null'), value: brsNull },
        { name: new BrsString('str'), value: brsUnquoted }
    ]);

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

        it('converts BRS float to bare float string', () => {
            actual = FormatJson.call(interpreter, brsFloat);
            expect(actual).toBeBrsFloatStrCloseTo(floatStr);
        });

        it('converts from BRS array', () => {
            actual = FormatJson.call(interpreter, brsArray);
            expect(actual).toEqual(brsArrayStr);
        });

        it('converts from BRS associative array', () => {
            actual = FormatJson.call(interpreter, brsAssociativeArray);
            expect(actual).toEqual(brsAssociativeArrayStr);
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

        it('converts bare float string to BRS float', () => {
            actual = ParseJson.call(interpreter, brsBareFloat);
            expect(actual).toBeBrsFloatCloseTo(floatStr);
        });

        it('converts to BRS array', () => {
            actual = ParseJson.call(interpreter, brsArrayStr);
            expect(actual).toEqualBrsArray(brsArray);
        });

        it('converts to BRS associative array', () => {
            actual = ParseJson.call(interpreter, brsAssociativeArrayStr);
            expect(actual).toEqualBrsAssociativeArray(brsAssociativeArray);
        });
    });
});
