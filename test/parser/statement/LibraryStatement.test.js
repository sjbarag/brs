const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsString, Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser library statements", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it('supports library statements at top of file', () => {
        const { tokens } = brs.lexer.Lexer.scan(`
            Library "v30/bslCore.brs"
            sub main()
            end sub
        `);
        const { statements, errors } = parser.parse(tokens);
        expect(errors.length).toEqual(0);
        expect({ errors, statements }).toMatchSnapshot();
    });

    it('adds recoverable error for library statements NOT at top of file', () => {
        const { tokens } = brs.lexer.Lexer.scan(`
            sub main()
            end sub
            Library "v30/bslCore.brs"
        `);
        const { statements, errors } = parser.parse(tokens);
        expect(errors.length).toBeGreaterThan(0);
        expect({ errors, statements }).toMatchSnapshot();
    });

    it('adds recoverable error for library statements inside of function body', () => {
        const { tokens } = brs.lexer.Lexer.scan(`
            sub main()
                Library "v30/bslCore.brs"
            end sub
        `);
        const { statements, errors } = parser.parse(tokens);
        expect(errors.length).toEqual(1);
        expect({ errors, statements }).toMatchSnapshot();
    });
});
