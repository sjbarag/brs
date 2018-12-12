const { Interpreter } = require('../../lib/interpreter');
const { BrsBoolean, BrsInvalid, BrsString } = require("../../lib/brsTypes");
const { FormatJson, ParseJson } = require("../../lib/stdlib/index");

describe('global JSON functions', () => {
    let interpreter = new Interpreter();
    let brsBareNull = new BrsString('null')
    let brsBareFalse = new BrsString('false')

    describe('FormatJson', () => {
        it('converts BRS invalid to bare null string', () => {
            actual = FormatJson.call(interpreter, BrsInvalid.Instance);
            expect(actual).toMatchObject(brsBareNull);
        });

        it('converts BRS false to bare false string', () => {
            actual = FormatJson.call(interpreter, BrsBoolean.False);
            expect(actual).toMatchObject(brsBareFalse);
        });
    });

    describe('ParseJson', () => {
        it('converts bare null string to BRS invalid', () => {
            actual = ParseJson.call(interpreter, brsBareNull);
            expect(actual).toBe(BrsInvalid.Instance);
        });

        it('converts bare false string to BRS false', () => {
            actual = ParseJson.call(interpreter, brsBareFalse);
            expect(actual).toBe(BrsBoolean.False);
        });
    });
});
