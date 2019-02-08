const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");
describe("parser indexed assignment", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it("assigns to dotted index", () => {
        let { statements, errors } = parser.parse([
            identifier("foo"),
            token(Lexeme.Dot, "."),
            identifier("bar"),
            token(Lexeme.Equal, "="),
            token(Lexeme.Function, "function"),
            token(Lexeme.LeftParen, "("),
            token(Lexeme.RightParen, ")"),
            token(Lexeme.Newline, "\\n"),
            token(Lexeme.EndFunction, "end function"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("assigns to bracketed index", () => {
        let { statements, errors } = parser.parse([
            identifier("someArray"),
            token(Lexeme.LeftSquare, "["),
            token(Lexeme.Integer, "0", new Int32(0)),
            token(Lexeme.RightSquare, "]"),
            token(Lexeme.Equal, "="),
            token(Lexeme.Function, "function"),
            token(Lexeme.LeftParen, "("),
            token(Lexeme.RightParen, ")"),
            token(Lexeme.Newline, "\\n"),
            token(Lexeme.EndFunction, "end function"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });
});
