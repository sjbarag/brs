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
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.Dot, text: ".", line: 1 },
                { kind: Lexeme.Identifier, text: "bar", line: 1 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("bracketed", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
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
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.Dot, text: ".", line: 1 },
                { kind: Lexeme.Identifier, text: "bar", line: 1 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("bracketed", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                token(Lexeme.Integer, "0", new Int32(0)),
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                token(Lexeme.Integer, "6", new Int32(6)),
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("mixed", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.Dot, text: ".", line: 1 },
                { kind: Lexeme.Identifier, text: "bar", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                token(Lexeme.Integer, "0", new Int32(0)),
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                { kind: Lexeme.Dot, text: ".", line: 1 },
                { kind: Lexeme.Identifier, text: "baz", line: 1 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
