const { Interpreter } = require('../../lib/interpreter');
const { BrsInvalid, BrsString, Int32 } = require("../../lib/brsTypes");
const { FormatJson, ParseJson } = require("../../lib/stdlib/index");

describe('global JSON functions', () => {
    let interpreter = new Interpreter();

    describe('FormatJson', () => {
        it('converts invalid to bare null', () => {
            actual = FormatJson.call(interpreter, BrsInvalid.Instance);
            expect(actual).toMatchObject(new BrsString('null'));
        });
    });

    describe('ParseJson', () => {
        it('converts bare null to invalid', () => {
            actual = ParseJson.call(interpreter, new BrsString('null'));
            expect(actual).toMatchObject(BrsInvalid.Instance);
        });
    });
});
