const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser for loops", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it("accepts a 'step' clause", () => {
        let { statements, errors } = parser.parse([
            token(Lexeme.For, "for"),
            token(Lexeme.Identifier, "i"),
            token(Lexeme.Equal, "="),
            token(Lexeme.Integer, "0", new Int32(0)),
            token(Lexeme.To, "to"),
            token(Lexeme.Integer, "5", new Int32(5)),
            token(Lexeme.Step, "step"),
            token(Lexeme.Integer, "2", new Int32(2)),
            token(Lexeme.Newline, "\n"),
            // body would go here, but it's not necessary for this test
            token(Lexeme.EndFor, "end for"),
            token(Lexeme.Newline, "\n"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements[0]).toBeDefined();
        expect(statements[0].increment).toBeDefined();
        expect(statements[0].increment.value).toEqual(new Int32(2));

        expect(statements).toMatchSnapshot();
    });

    it("defaults a missing 'step' clause to '1'", () => {
        let { statements, errors } = parser.parse([
            token(Lexeme.For, "for"),
            token(Lexeme.Identifier, "i"),
            token(Lexeme.Equal, "="),
            token(Lexeme.Integer, "0", new Int32(0)),
            token(Lexeme.To, "to"),
            token(Lexeme.Integer, "5", new Int32(5)),
            token(Lexeme.Newline, "\n"),
            // body would go here, but it's not necessary for this test
            token(Lexeme.EndFor, "end for"),
            token(Lexeme.Newline, "\n"),
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements[0]).toBeDefined();
        expect(statements[0].increment).toBeDefined();
        expect(statements[0].increment.value).toEqual(new Int32(1));

        expect(statements).toMatchSnapshot();
    });

    it("allows 'next' to terminate loop", () => {
        let { statements, errors } = parser.parse([
            token(Lexeme.For, "for"),
            token(Lexeme.Identifier, "i"),
            token(Lexeme.Equal, "="),
            token(Lexeme.Integer, "0", new Int32(0)),
            token(Lexeme.To, "to"),
            token(Lexeme.Integer, "5", new Int32(5)),
            token(Lexeme.Newline, "\n"),
            // body would go here, but it's not necessary for this test
            token(Lexeme.Next, "next"),
            token(Lexeme.Newline, "\n"),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).toMatchSnapshot();
    });
});
