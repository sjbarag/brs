const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsBoolean, Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser array literals", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("empty arrays", () => {
        test("on one line", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.RightSquare, "]"),
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
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.RightSquare, "]"),
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
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Integer, "1", new Int32(1)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Integer, "2", new Int32(2)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.RightSquare, "]"),
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
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Integer, "1", new Int32(1)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Integer, "2", new Int32(2)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.RightSquare, "]"),
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
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Integer, "1", new Int32(1)),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Integer, "2", new Int32(2)),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.RightSquare, "]"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });

    describe("contents", () => {
        it("can contain primitives", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Integer, "1", new Int32(1)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Integer, "2", new Int32(2)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.RightSquare, "]"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("can contain other arrays", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.LeftSquare, "["),
                    token(Lexeme.LeftSquare, "["),
                    token(Lexeme.Integer, "1", new Int32(1)),
                    token(Lexeme.Comma, ","),
                    token(Lexeme.Integer, "2", new Int32(2)),
                    token(Lexeme.Comma, ","),
                    token(Lexeme.Integer, "3", new Int32(3)),
                    token(Lexeme.RightSquare, "]"),
                token(Lexeme.Comma, ","),
                    token(Lexeme.LeftSquare, "["),
                    token(Lexeme.Integer, "4", new Int32(4)),
                    token(Lexeme.Comma, ","),
                    token(Lexeme.Integer, "5", new Int32(5)),
                    token(Lexeme.Comma, ","),
                    token(Lexeme.Integer, "6", new Int32(6)),
                    token(Lexeme.RightSquare, "]"),
                token(Lexeme.RightSquare, "]"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("can contain expressions", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Integer, "1", new Int32(1)),
                token(Lexeme.Plus, "+"),
                token(Lexeme.Integer, "2", new Int32(2)),
                token(Lexeme.Comma, ","),
                token(Lexeme.Not, "not"),
                token(Lexeme.False, "false", BrsBoolean.False),
                token(Lexeme.RightSquare, "]"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
