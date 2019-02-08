const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32, BrsBoolean } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("unary expressions", () => {
        it("parses unary 'not'", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Not, "not"),
                token(Lexeme.True, "true", BrsBoolean.True),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses consecutive unary 'not'", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Not, "not"),
                token(Lexeme.Not, "not"),
                token(Lexeme.Not, "not"),
                token(Lexeme.Not, "not"),
                token(Lexeme.Not, "not"),
                token(Lexeme.True, "true", BrsBoolean.True),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses unary '-'", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Minus, "-"),
                token(Lexeme.Integer, "5", new Int32(5)),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses consecutive unary '-'", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Minus, "-"),
                token(Lexeme.Minus, "-"),
                token(Lexeme.Minus, "-"),
                token(Lexeme.Minus, "-"),
                token(Lexeme.Minus, "-"),
                token(Lexeme.Integer, "5", new Int32(5)),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
