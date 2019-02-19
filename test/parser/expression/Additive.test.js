const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser additive expressions", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it("parses left-associative addition chains", () => {
        let { statements, errors } = parser.parse([
            identifier("_"),
            token(Lexeme.Equal, "="),
            token(Lexeme.Integer, "1", new Int32(1)),
            token(Lexeme.Plus, "+"),
            token(Lexeme.Integer, "2", new Int32(2)),
            token(Lexeme.Plus, "+"),
            token(Lexeme.Integer, "3", new Int32(3)),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("parses left-associative subtraction chains", () => {
        let { statements, errors } = parser.parse([
            identifier("_"),
            token(Lexeme.Equal, "="),
            token(Lexeme.Integer, "1", new Int32(1)),
            token(Lexeme.Minus, "-"),
            token(Lexeme.Integer, "2", new Int32(2)),
            token(Lexeme.Minus, "-"),
            token(Lexeme.Integer, "3", new Int32(3)),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("tracks starting and ending locations", () => {
        // 0   0   0   1
        // 0   4   8   2
        // ^^ columns ^^
        //
        // _ = 1 + 2 + 3
        let { statements, errors } = parser.parse([
            {
                kind: Lexeme.Identifier,
                text: "_",
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
                    end: { line: 1, column: 2 }
                }
            },
            {
                kind: Lexeme.Integer,
                text: "1",
                isReserved: false,
                literal: new Int32(1),
                location: {
                    start: { line: 1, column: 4 },
                    end: { line: 1, column: 5 }
                }
            },
            {
                kind: Lexeme.Plus,
                text: "+",
                isReserved: false,
                location: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 }
                }
            },
            {
                kind: Lexeme.Integer,
                text: "2",
                isReserved: false,
                literal: new Int32(2),
                location: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 9 }
                }
            },
            {
                kind: Lexeme.Plus,
                text: "+",
                isReserved: false,
                location: {
                    start: { line: 1, column: 10 },
                    end: { line: 1, column: 11 }
                }
            },
            {
                kind: Lexeme.Integer,
                text: "3",
                isReserved: false,
                literal: new Int32(3),
                location: {
                    start: { line: 1, column: 12 },
                    end: { line: 1, column: 13 }
                }
            },
            {
                kind: Lexeme.Eof,
                text: "\0",
                isReserved: false,
                location: {
                    start: { line: 1, column: 13 },
                    end: { line: 1, column: 14 }
                }
            }
        ]);

        expect(errors).toEqual([]);
        expect(statements.length).toBe(1);
        expect(statements[0].value.location).toEqual({
            start: { line: 1, column: 4 },
            end: { line: 1, column: 13 }
        })
    });
});
