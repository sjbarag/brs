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

const { allArgs } = require("../e2e/E2ETests");

async function withEnv(k, v, fn) {
    let save = process.env[k];
    try {
        process.env[k] = v;
        return await fn();
    } finally {
        process.env[k] = save;
    }
}

async function expectConsoleError(expected, fn) {
    let consoleError = jest.spyOn(console, 'error').mockImplementation(() => { /* no op */ });
    return await withEnv('NODE_ENV', 'force test!', async () => {
        await fn();
        expect(allArgs(consoleError)).toEqual([
            expect.stringMatching(expected)
        ]);
    });
}

describe('global JSON functions', () => {
    let interpreter = new Interpreter();

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('FormatJson', () => {
        it('rejects non-convertible types', async () => {
            await expectConsoleError(/BRIGHTSCRIPT: ERROR: FormatJSON: /, async () => {
                await expect(FormatJson.call(interpreter, Uninitialized.Instance)).resolves.toEqual(new BrsString(''));
            });
        });

        it('rejects nested associative array references', async () => {
            let aa = new AssociativeArray([
                { name: new BrsString('foo'), value: new BrsString('bar') },
                { name: new BrsString('lorem'), value: Float.fromString('1.234') }
            ]);
            aa.set(new BrsString('self'), aa);
            await expectConsoleError(/BRIGHTSCRIPT: ERROR: FormatJSON: Nested object reference/, async () => {
                await expect(FormatJson.call(interpreter, aa)).resolves.toEqual(new BrsString(''));
            });
        });

        it('rejects nested array references', async () => {
            let a = new BrsArray([
                new BrsString('bar'),
                Float.fromString('1.234')
            ]);
            await a.getMethod("push").call(interpreter, a)
            await expectConsoleError(/BRIGHTSCRIPT: ERROR: FormatJSON: Nested object reference/, async () => {
                await expect(FormatJson.call(interpreter, a)).resolves.toEqual(new BrsString(''));
            });
        });

        it('converts BRS invalid to bare null string', async () => {
            await expect(FormatJson.call(interpreter, BrsInvalid.Instance)).resolves.toEqual(new BrsString('null'));
        });

        it('converts BRS false to bare false string', async () => {
            await expect(FormatJson.call(interpreter, BrsBoolean.False)).resolves.toEqual(new BrsString('false'));
        });

        it('converts BRS string to bare (quoted) string', async () => {
            await expect(FormatJson.call(interpreter, new BrsString('ok'))).resolves.toEqual(new BrsString(`"ok"`));
        });

        it('converts BRS integer to bare integer string', async () => {
            await expect(FormatJson.call(interpreter, Int32.fromString('2147483647'))).resolves.toEqual(new BrsString('2147483647'));
        });

        it('converts BRS longInteger to bare longInteger string', async () => {
            await expect(FormatJson.call(interpreter, Int64.fromString('9223372036854775807'))).resolves.toEqual(new BrsString('9223372036854775807'));
        });

        it('converts BRS float to bare float string, within seven significant digits', async () => {
            let actual = await FormatJson.call(interpreter, Float.fromString('3.141592653589793238462643383279502884197169399375'));
            expect(actual).toBeInstanceOf(BrsString);
            expect(Number.parseFloat(actual.toString())).toBeCloseTo(Number.parseFloat('3.141592653589793238462643383279502884197169399375'), Float.IEEE_FLOAT_SIGFIGS);
        });

        it('converts from BRS array', async () => {
            let brsArray = new BrsArray([
                new BrsBoolean(false),
                Float.fromString('3.14'),
                Int32.fromString('2147483647'),
                Int64.fromString('9223372036854775807'),
                BrsInvalid.Instance,
                new BrsString('ok')
            ]);
            await expect(
                FormatJson.call(interpreter, brsArray)
            ).resolves.toEqual(
                new BrsString(`[false,3.14,2147483647,9223372036854775807,null,"ok"]`)
            );
        });

        it('converts from BRS associative array to key-sorted JSON string', async () => {
            let brsAssociativeArrayDesc = new AssociativeArray([
                { name: new BrsString('string'), value: new BrsString('ok') },
                { name: new BrsString('null'), value: BrsInvalid.Instance },
                { name: new BrsString('longinteger'), value: Int64.fromString('9223372036854775807') },
                { name: new BrsString('integer'), value: Int32.fromString('2147483647') },
                { name: new BrsString('float'), value: Float.fromString('3.14') },
                { name: new BrsString('boolean'), value: new BrsBoolean(false) }
            ]);
            let brsAssociativeArrayStrAsc = new BrsString(`{"boolean":false,"float":3.14,"integer":2147483647,"longinteger":9223372036854775807,"null":null,"string":"ok"}`);
            await expect(FormatJson.call(interpreter, brsAssociativeArrayDesc)).resolves.toEqual(brsAssociativeArrayStrAsc);
        });
    });

    describe('ParseJson', () => {
        it('rejects empty strings with special case message', async () => {
            await expectConsoleError(/BRIGHTSCRIPT: ERROR: ParseJSON: Data is empty/, async () => {
                await expect(ParseJson.call(interpreter, new BrsString(''))).resolves.toBe(BrsInvalid.Instance);
            });
        });

        it('converts bare null string to BRS invalid', async () => {
            await expect(ParseJson.call(interpreter, new BrsString('null'))).resolves.toBe(BrsInvalid.Instance);
        });

        it('converts bare false string to BRS false', async () => {
            await expect(ParseJson.call(interpreter, new BrsString('false'))).resolves.toBe(BrsBoolean.False);
        });

        it('converts bare (quoted) string to BRS string', async () => {
            await expect(ParseJson.call(interpreter, new BrsString(`"ok"`))).resolves.toEqual(new BrsString('ok'));
        });

        it('converts bare integer string to BRS integer', async () => {
            await expect(ParseJson.call(interpreter, new BrsString('2147483647'))).resolves.toEqual(Int32.fromString('2147483647'));
        });

        it('converts bare longInteger string to BRS longInteger', async () => {
            await expect(ParseJson.call(interpreter, new BrsString('9223372036854775807'))).resolves.toEqual(Int64.fromString('9223372036854775807'));
        });

        it('converts bare float string to BRS float, within seven significant digits', async() => {
            let actual = await ParseJson.call(interpreter, new BrsString('3.141592653589793238462643383279502884197169399375'));
            expect(actual).toBeInstanceOf(Float);
            expect(actual.getValue()).toBeCloseTo(Number.parseFloat('3.141592653589793238462643383279502884197169399375'), Float.IEEE_FLOAT_SIGFIGS);
        });

        it('converts to BRS array', async () => {
            let expected = new BrsArray([
                new BrsBoolean(false),
                Float.fromString('3.14'),
                Int32.fromString('2147483647'),
                Int64.fromString('9223372036854775807'),
                BrsInvalid.Instance,
                new BrsString('ok')
            ]);
            let actual = await ParseJson.call(interpreter, new BrsString(`[false,3.14,2147483647,9223372036854775807,null,"ok"]`));
            expect(actual).toBeInstanceOf(BrsArray);
            expect(actual.getElements()).toEqual(expected.getElements());
        });

        it('converts to BRS associative array', async () => {
            let expected = new AssociativeArray([
                { name: new BrsString('string'), value: new BrsString('ok') },
                { name: new BrsString('null'), value: BrsInvalid.Instance },
                { name: new BrsString('longinteger'), value: Int64.fromString('9223372036854775807') },
                { name: new BrsString('integer'), value: Int32.fromString('2147483647') },
                { name: new BrsString('float'), value: Float.fromString('3.14') },
                { name: new BrsString('boolean'), value: new BrsBoolean(false) }
            ]);
            let brsAssociativeArrayStrAsc = new BrsString(`{"boolean":false,"float":3.14,"integer":2147483647,"longinteger":9223372036854775807,"null":null,"string":"ok"}`);
            let actual = await ParseJson.call(interpreter, brsAssociativeArrayStrAsc);
            expect(actual).toBeInstanceOf(AssociativeArray);
            actualKeys = actual.getElements();
            expect(actualKeys).toEqual(expected.getElements());
            actualKeys.forEach((key) => { expect(actual.get(key)).toEqual(expected.get(key)); });
        });
    });
});
