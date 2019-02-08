const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsString, Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser associative array literals", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("empty associative arrays", () => {
        test("on one line", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.LeftBrace, "{"),
                token(Lexeme.RightBrace, "}"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("on multiple lines", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.LeftBrace, "{"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.RightBrace, "}"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });

    describe("filled arrays", () => {
        test("on one line", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.LeftBrace, "{"),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.Colon, ":"),
                token(Lexeme.Integer, "1", new Int32(1)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Identifier, "bar"),
                token(Lexeme.Colon, ":"),
                token(Lexeme.Integer, "2", new Int32(2)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Identifier, "baz"),
                token(Lexeme.Colon, ":"),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.RightBrace, "}"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("on multiple lines with commas", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.LeftBrace, "{"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.Colon, ":"),
                token(Lexeme.Integer, "1", new Int32(1)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Identifier, "bar"),
                token(Lexeme.Colon, ":"),
                token(Lexeme.Integer, "2", new Int32(2)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Identifier, "baz"),
                token(Lexeme.Colon, ":"),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.RightBrace, "}"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("on multiple lines without commas", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.LeftBrace, "{"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.Colon, ":"),
                token(Lexeme.Integer, "1", new Int32(1)),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Identifier, "bar"),
                token(Lexeme.Colon, ":"),
                token(Lexeme.Integer, "2", new Int32(2)),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Identifier, "baz"),
                token(Lexeme.Colon, ":"),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.RightBrace, "}"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });

    it("allows a mix of quoted and unquoted keys", () => {
        let { statements, errors } = parser.parse([
            token(Lexeme.Identifier, "_"),
            token(Lexeme.Equal, "="),
            token(Lexeme.LeftBrace, "{"),
            token(Lexeme.Newline, "\n"),
            token(Lexeme.String, "foo", new BrsString("foo")),
            token(Lexeme.Colon, ":"),
            token(Lexeme.Integer, "1", new Int32(1)),
            token(Lexeme.Comma, ","),
            token(Lexeme.Newline, "\n"),
            token(Lexeme.Identifier, "bar"),
            token(Lexeme.Colon, ":"),
            token(Lexeme.Integer, "2", new Int32(2)),
            token(Lexeme.Comma, ","),
            token(Lexeme.Newline, "\n"),
            token(Lexeme.String, "requires-hyphens", new BrsString("requires-hypens")),
            token(Lexeme.Colon, ":"),
            token(Lexeme.Integer, "3", new Int32(3)),
            token(Lexeme.Newline, "\n"),
            token(Lexeme.RightBrace, "}"),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });
});
