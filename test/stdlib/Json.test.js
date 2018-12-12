const { Interpreter } = require('../../lib/interpreter');
const { FormatJson, ParseJson } = require("../../lib/stdlib/index");
const {
    BrsBoolean,
    BrsInvalid,
    BrsString,
    Uninitialized
} = require("../../lib/brsTypes");

describe('global JSON functions', () => {
    let interpreter = new Interpreter();
    let brsBareNull = new BrsString('null')
    let brsBareFalse = new BrsString('false')
    let brsEmpty = new BrsString('')
    let brsUnquoted = new BrsString('ok')
    let brsQuoted = new BrsString('"ok"')

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

        it('converts BRS string to bare string', () => {
            actual = FormatJson.call(interpreter, brsUnquoted);
            expect(actual).toMatchObject(brsQuoted);
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

        it('converts bare string to BRS string', () => {
            actual = ParseJson.call(interpreter, brsQuoted);
            expect(actual).toMatchObject(brsUnquoted);
        });
    });
});
