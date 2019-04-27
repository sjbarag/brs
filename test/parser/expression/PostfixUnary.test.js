const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32, BrsBoolean } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser postfix unary expressions", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it("parses postfix '++' for variables", () => {
        let { statements, errors } = parser.parse([
            identifier("_"),
            token(Lexeme.Equal, "="),
            identifier("foo"),
            token(Lexeme.PlusPlus, "++"),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("parses postfix '--' for dotted get expressions", () => {
        let { statements, errors } = parser.parse([
            identifier("_"),
            token(Lexeme.Equal, "="),
            identifier("obj"),
            token(Lexeme.Dot, "."),
            identifier("property"),
            token(Lexeme.MinusMinus, "--"),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("parses postfix '++' for indexed get expressions", () => {
        let { statements, errors } = parser.parse([
            identifier("_"),
            token(Lexeme.Equal, "="),
            identifier("obj"),
            token(Lexeme.LeftSquare, "["),
            identifier("property"),
            token(Lexeme.RightSquare, "]"),
            token(Lexeme.PlusPlus, "++"),
            EOF
        ]);

        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("disallows consecutive postfix operators", () => {
        let { statements, errors } = parser.parse([
            identifier("_"),
            token(Lexeme.Equal, "="),
            identifier("foo"),
            token(Lexeme.PlusPlus, "++"),
            token(Lexeme.PlusPlus, "++"),
            EOF
        ]);

        expect(errors).toHaveLength(1);
        expect(errors[0]).toMatchObject({
            message: expect.stringMatching("Consecutive increment/decrement operators are not allowed")
        });
    });


    test("location tracking", () => {
        /**
         *    0   0   0   1   1
         *    0   4   8   2   6
         *  +------------------
         * 1| three = four--
         */
        let { statements, errors } = parser.parse([
            {
                kind: Lexeme.Identifier,
                text: "three",
                isReserved: false,
                location: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 5 }
                }
            },
            {
                kind: Lexeme.Equal,
                text: "=",
                isReserved: false,
                location: {
                    start: { line: 1, column: 6 },
                    end: { line: 1, column: 7 }
                }
            },
            {
                kind: Lexeme.Identifier,
                text: "four",
                isReserved: false,
                location: {
                    start: { line: 1, column: 8 },
                    end: { line: 1, column: 12 }
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
        expect(statements).toHaveLength(1);
        expect(statements[0].value.location).toEqual({
            start: { line: 1, column: 8 },
            end: { line: 1, column: 12 }
        });
    });
});