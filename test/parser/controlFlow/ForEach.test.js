const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Expr, Stmt } = brs.parser;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser foreach loops", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it("requires a name and target", () => {
        let { statements, errors } = parser.parse([
            token(Lexeme.ForEach, "for each"),
            token(Lexeme.Identifier, "word"),
            token(Lexeme.Identifier, "in"),
            token(Lexeme.Identifier, "lipsum"),
            token(Lexeme.Newline, "\n"),

            // body would go here, but it's not necessary for this test
            token(Lexeme.EndFor, "end for"),
            token(Lexeme.Newline, "\n"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();

        let forEach = statements[0];
        expect(forEach).toBeInstanceOf(Stmt.ForEach);

        expect(forEach.item).toEqual(
            token(Lexeme.Identifier, "word")
        );
        expect(forEach.target).toBeInstanceOf(Expr.Variable);
        expect(forEach.target.name).toEqual(
            token(Lexeme.Identifier, "lipsum")
        );

        expect(statements).toMatchSnapshot();
    });

    it("allows 'next' to terminate loop", () => {
        let { statements, errors } = parser.parse([
            token(Lexeme.ForEach, "for each"),
            token(Lexeme.Identifier, "word"),
            token(Lexeme.Identifier, "in"),
            token(Lexeme.Identifier, "lipsum"),
            token(Lexeme.Newline, "\n"),

            // body would go here, but it's not necessary for this test
            token(Lexeme.Next, "next"),
            token(Lexeme.Newline, "\n"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).toMatchSnapshot();
    });
});
