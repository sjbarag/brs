const { Interpreter } = require('../../lib/interpreter');
const { FormatJson, ParseJson } = require("../../lib/stdlib/index");
const {
    BrsBoolean,
    BrsInvalid,
    BrsString,
    Double,
    Float,
    Int32,
    Int64,
    Uninitialized
} = require("../../lib/brsTypes");

describe('global JSON functions', () => {
    let interpreter = new Interpreter();

    let brsBareNull = new BrsString('null');

    let brsBareFalse = new BrsString('false');

    let brsEmpty = new BrsString('');

    let brsUnquoted = new BrsString('ok');
    let brsQuoted = new BrsString('"ok"');

    let floatStr = '3.402823061e+38';
    let brsFloat = Float.fromString(floatStr);
    let brsBareFloat = new BrsString(floatStr);

    let integerStr = '2147483647';
    let brsInteger = Int32.fromString(integerStr);
    let brsBareInteger = new BrsString(integerStr);

    let longIntegerStr = '9223372036854775807';
    let brsLongInteger = Int64.fromString(longIntegerStr);
    let brsBareLongInteger = new BrsString(longIntegerStr);

    let doubleStr = '1.7976931348623e+308';
    let brsDouble = Double.fromString(doubleStr);
    let brsBareDouble = new BrsString(doubleStr);

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

        xit('converts BRS longInteger to bare longInteger string', () => {
            actual = FormatJson.call(interpreter, brsLongInteger);
            expect(actual).toMatchObject(brsBareLongInteger);
        });

        xit('converts BRS float to bare float string', () => {
            actual = FormatJson.call(interpreter, brsFloat);
            expect(actual).toMatchObject(brsBareFloat);
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

        xit('converts bare float string to BRS float', () => {
            actual = ParseJson.call(interpreter, brsBareFloat);
            expect(actual).toMatchObject(brsFloat);
        });
    });
});
