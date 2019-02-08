const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("additive expressions", () => {
        it("parses left-associative addition chains", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Integer, "1", new Int32(1)),
                { kind: Lexeme.Plus, text: "+", line: 1 },
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.Plus, text: "+", line: 1 },
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
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Integer, "1", new Int32(1)),
                { kind: Lexeme.Minus, text: "-", line: 1 },
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.Minus, text: "-", line: 1 },
                token(Lexeme.Integer, "3", new Int32(3)),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
