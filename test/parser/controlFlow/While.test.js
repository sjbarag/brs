const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsBoolean, BrsString } = brs.types;
const { token, identifier, EOF } = require("../ParserTests");

describe("parser while statements", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    test("while without exit", () => {
        const { statements, errors } = parser.parse([
            token(Lexeme.While, "while"),
            token(Lexeme.True, "true", BrsBoolean.True),
            token(Lexeme.Newline, "\n"),
            token(Lexeme.Print, "print"),
            token(Lexeme.String, "looping", new BrsString("looping")),
            token(Lexeme.Newline, "\n"),
            token(Lexeme.EndWhile, "end while"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    test("while with exit", () => {
        const { statements, errors } = parser.parse([
            token(Lexeme.While, "while"),
            token(Lexeme.True, "true", BrsBoolean.True,),
            token(Lexeme.Newline, "\n"),
            token(Lexeme.Print, "print"),
            token(Lexeme.String, "looping", new BrsString("looping")),
            token(Lexeme.Newline, "\n"),
            token(Lexeme.ExitWhile, "exit while"),
            token(Lexeme.Newline, "\n"),
            token(Lexeme.EndWhile, "end while"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });
});
