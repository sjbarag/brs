const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Float } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("multiplicative expressions", () => {
        it("parses left-associative multiplication chains", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Float, "3.0", new Float(3.0)),
                { kind: Lexeme.Star, text: "*", line: 1 },
                token(Lexeme.Float, "5.0", new Float(5.0)),
                { kind: Lexeme.Star, text: "*", line: 1 },
                token(Lexeme.Float, "7.0", new Float(7.0)),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses left-associative division chains", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Float, "7.0", new Float(7.0)),
                { kind: Lexeme.Slash, text: "/", line: 1 },
                token(Lexeme.Float, "5.0", new Float(5.0)),
                { kind: Lexeme.Slash, text: "/", line: 1 },
                token(Lexeme.Float, "3.0", new Float(3.0)),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses left-associative modulo chains", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Float, "7.0", new Float(7.0)),
                { kind: Lexeme.Mod, text: "MOD", line: 1 },
                token(Lexeme.Float, "5.0", new Float(5.0)),
                { kind: Lexeme.Mod, text: "MOD", line: 1 },
                token(Lexeme.Float, "3.0", new Float(3.0)),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses left-associative integer-division chains", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Float, "32.5", new Float(32.5)),
                { kind: Lexeme.Backslash, text: "\\", line: 1 },
                token(Lexeme.Float, "5.0", new Float(5.0)),
                { kind: Lexeme.Backslash, text: "\\", line: 1 },
                token(Lexeme.Float, "3.0", new Float(3.0)),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
