const { Interpreter } = require('../../lib/interpreter');
const { BrsInvalid, BrsString, Int32 } = require("../../lib/brsTypes");
const { FormatJson, ParseJson } = require("../../lib/stdlib/index");

describe('global JSON functions', () => {
    let interpreter = new Interpreter();
    let bareNull = new BrsString('null')

    describe('FormatJson', () => {
        it('converts BRS invalid to bare null string', () => {
            actual = FormatJson.call(interpreter, BrsInvalid.Instance);
            expect(actual).toMatchObject(bareNull);
        });
    });

    describe('ParseJson', () => {
        it('converts bare null string to BRS invalid', () => {
            actual = ParseJson.call(interpreter, bareNull);
            expect(actual).toBe(BrsInvalid.Instance);
        });
    });
});
