const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser call expressions", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it("parses named function calls", () => {
        const { statements, errors } = parser.parse([
            identifier("RebootSystem"),
            { kind: Lexeme.LeftParen,  text: "(", line: 1 },
            token(Lexeme.RightParen, ")"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("allows closing parentheses on separate line", () => {
        const { statements, errors } = parser.parse([
            identifier("RebootSystem"),
            { kind: Lexeme.LeftParen,  text: "(", line: 1 },
            token(Lexeme.Newline, "\\n"),
            token(Lexeme.Newline, "\\n"),
            token(Lexeme.RightParen, ")"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("accepts arguments", () => {
        const { statements, errors } = parser.parse([
            identifier("add"),
            { kind: Lexeme.LeftParen,  text: "(", line: 1 },
            token(Lexeme.Integer, "1", new Int32(1)),
            { kind: Lexeme.Comma,  text: ",", line: 1 },
            token(Lexeme.Integer, "2", new Int32(2)),
            token(Lexeme.RightParen, ")"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements[0].expression.args).toBeTruthy();
        expect(statements).toMatchSnapshot();
    });
});
