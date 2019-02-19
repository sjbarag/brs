const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32, BrsString } = brs.types;
const { Expr, Stmt } = brs.parser;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser primary expressions", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it("parses numeric literals", () => {
        let equals = token(Lexeme.Equal, "=");
        let { statements, errors } = parser.parse([
            identifier("_"),
            equals,
            token(Lexeme.Integer, "5", new Int32(5)),
            EOF
        ]);
        expect(errors).toEqual([]);
        expect(statements).toMatchSnapshot();
    });

    it("parses string literals", () => {
        let equals = token(Lexeme.Equal, "=");
        let { statements, errors } = parser.parse([
            identifier("_"),
            equals,
            token(Lexeme.String, "hello", new BrsString("hello")),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toMatchSnapshot();
    });

    it("parses expressions in parentheses", () => {
        let { statements, errors } = parser.parse([
            identifier("_"),
            token(Lexeme.Equal, "="),
            token(Lexeme.Integer, "1", new Int32(1)),
            token(Lexeme.Plus, "+"),
            token(Lexeme.LeftParen, "("),
            token(Lexeme.Integer, "2", new Int32(2)),
            token(Lexeme.Star, "*"),
            token(Lexeme.Integer, "3", new Int32(3)),
            token(Lexeme.RightParen, ")"),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    test("location tracking", () => {
        /**
         *    0   0   0   1
         *    0   4   8   2
         *  +--------------
         * 1| a = 5
         * 2| b = "foo"
         * 3| c = ( 0 )
         */
        let { statements, errors } = parser.parse([
            {
                kind: Lexeme.Identifier,
                text: "a",
                isReserved: false,
                location: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 1 }
                }
            },
            {
                kind: Lexeme.Equal,
                text: "=",
                isReserved: false,
                location: {
                    start: { line: 1, column: 2 },
                    end: { line: 1, column: 3 }
                }
            },
            {
                kind: Lexeme.Integer,
                text: "5",
                literal: new Int32(5),
                isReserved: false,
                location: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 }
                }
            },
            {
                kind: Lexeme.Newline,
                text: "\n",
                isReserved: false,
                location: false,
                location: {
                    start: { line: 1, column: 5 },
                    end: { line: 1, column: 6 }
                }
            },
            {
                kind: Lexeme.Identifier,
                text: "b",
                isReserved: false,
                location: {
                    start: { line: 2, column: 0 },
                    end: { line: 2, column: 1 }
                }
            },
            {
                kind: Lexeme.Equal,
                text: "=",
                isReserved: false,
                location: {
                    start: { line: 2, column: 2 },
                    end: { line: 2, column: 3 }
                }
            },
            {
                kind: Lexeme.String,
                text: `"foo"`,
                literal: new BrsString("foo"),
                isReserved: false,
                location: {
                    start: { line: 2, column: 4 },
                    end: { line: 2, column: 9 }
                }
            },
            {
                kind: Lexeme.Newline,
                text: "\n",
                isReserved: false,
                location: {
                    start: { line: 2, column: 9 },
                    end: { line: 2, column: 10}
                }
            },
            {
                kind: Lexeme.Identifier,
                text: "c",
                isReserved: false,
                location: {
                    start: { line: 3, column: 0 },
                    end: { line: 3, column: 1 }
                }
            },
            {
                kind: Lexeme.Equal,
                text: "=",
                isReserved: false,
                location: {
                    start: { line: 3, column: 2 },
                    end: { line: 3, column: 3 }
                }
            },
            {
                kind: Lexeme.LeftParen,
                text: "(",
                isReserved: false,
                location: {
                    start: { line: 3, column: 4 },
                    end: { line: 3, column: 5 }
                }
            },
            {
                kind: Lexeme.Integer,
                text: "0",
                literal: new Int32(0),
                isReserved: false,
                location: {
                    start: { line: 3, column: 6 },
                    end: { line: 3, column: 7 }
                }
            },
            {
                kind: Lexeme.RightParen,
                text: ")",
                isReserved: false,
                location: {
                    start: { line: 3, column: 8 },
                    end: { line: 3, column: 9 }
                }
            },
            {
                kind: Lexeme.Eof,
                text: "\0",
                isReserved: false,
                location: {
                    start: { line: 2, column: 9 },
                    end: { line: 2, column: 10}
                }
            }
        ]);

        expect(errors).toEqual([]);
        expect(statements.length).toBe(3);
        expect(statements.map(s => s.value.location)).toEqual([
            {
                start: { line: 1, column: 4 },
                end: { line: 1, column: 5 }
            },
            {
                start: { line: 2, column: 4 },
                end: { line: 2, column: 9 }
            },
            {
                start: { line: 3, column: 4 },
                end: { line: 3, column: 9 }
            }
        ]);
    });
});
