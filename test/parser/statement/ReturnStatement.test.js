const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsString } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser return statements", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it("parses void returns", () => {
        let { statements, errors } = parser.parse([
            token(Lexeme.Function, "function"),
            identifier("foo"),
            token(Lexeme.LeftParen, "("),
            token(Lexeme.RightParen, ")"),
            token(Lexeme.Newline, "\\n"),
            token(Lexeme.Return, "return"),
            token(Lexeme.Newline, "\\n"),
            token(Lexeme.EndFunction, "end function"),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("parses literal returns", () => {
        let { statements, errors } = parser.parse([
            token(Lexeme.Function, "function"),
            identifier("foo"),
            token(Lexeme.LeftParen, "("),
            token(Lexeme.RightParen, ")"),
            token(Lexeme.Newline, "\\n"),
            token(Lexeme.Return, "return"),
            { kind: Lexeme.String, literal: new BrsString("test"), text: '"test"', line: 2 },
            token(Lexeme.Newline, "\\n"),
            token(Lexeme.EndFunction, "end function"),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("parses expression returns", () => {
        let { statements, errors } = parser.parse([
            token(Lexeme.Function, "function"),
            identifier("foo"),
            token(Lexeme.LeftParen, "("),
            token(Lexeme.RightParen, ")"),
            token(Lexeme.Newline, "\\n"),
            token(Lexeme.Return, "return"),
            identifier("RebootSystem"),
            { kind: Lexeme.LeftParen,  text: "(", line: 2 },
            token(Lexeme.RightParen, ")"),
            token(Lexeme.Newline, "\\n"),
            token(Lexeme.EndFunction, "end function"),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });
});
