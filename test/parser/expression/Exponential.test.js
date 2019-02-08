const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("exponential expressions", () => {
        it("parses exponential operators", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.Caret, text: "^", line: 1 },
                token(Lexeme.Integer, "3", new Int32(3)),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses repeated exponential operators as left-associative", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.Caret, text: "^", line: 1 },
                token(Lexeme.Integer, "3", new Int32(3)),
                { kind: Lexeme.Caret, text: "^", line: 1 },
                token(Lexeme.Integer, "4", new Int32(4)),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
