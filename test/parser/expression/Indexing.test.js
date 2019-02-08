const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser indexing", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("one level", () => {
        test("dotted", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.Dot, "."),
                token(Lexeme.Identifier, "bar"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("bracketed", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Integer, "2", new Int32(2)),
                token(Lexeme.RightSquare, "]"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });

    describe("multi-level", () => {
        test("dotted", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.Dot, "."),
                token(Lexeme.Identifier, "bar"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("bracketed", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Integer, "2", new Int32(2)),
                token(Lexeme.RightSquare, "]"),
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Integer, "0", new Int32(0)),
                token(Lexeme.RightSquare, "]"),
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Integer, "6", new Int32(6)),
                token(Lexeme.RightSquare, "]"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("mixed", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.Dot, "."),
                token(Lexeme.Identifier, "bar"),
                token(Lexeme.LeftSquare, "["),
                token(Lexeme.Integer, "0", new Int32(0)),
                token(Lexeme.RightSquare, "]"),
                token(Lexeme.Dot, "."),
                token(Lexeme.Identifier, "baz"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
