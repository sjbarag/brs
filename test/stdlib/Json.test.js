const { Interpreter } = require('../../lib/interpreter');
const { BrsBoolean, BrsInvalid, BrsString } = require("../../lib/brsTypes");
const { FormatJson, ParseJson } = require("../../lib/stdlib/index");

describe('global JSON functions', () => {
    let interpreter = new Interpreter();
    let bareNull = new BrsString('null')
    let bareFalse = new BrsString('false')

    describe('FormatJson', () => {
        it('converts BRS invalid to bare null string', () => {
            actual = FormatJson.call(interpreter, BrsInvalid.Instance);
            expect(actual).toMatchObject(bareNull);
        });

        it('converts BRS false to bare false string', () => {
            actual = FormatJson.call(interpreter, BrsBoolean.False);
            expect(actual).toMatchObject(bareFalse);
        });
    });

    describe('ParseJson', () => {
        it('converts bare null string to BRS invalid', () => {
            actual = ParseJson.call(interpreter, bareNull);
            expect(actual).toBe(BrsInvalid.Instance);
        });

        it('converts bare false string to BRS false', () => {
            actual = ParseJson.call(interpreter, bareFalse);
            expect(actual).toBe(BrsBoolean.False);
        });
    });
});
