const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsBoolean } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("boolean expressions", () => {
        it("parses boolean ANDs", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.True, "true", BrsBoolean.True),
                token(Lexeme.And, "and"),
                token(Lexeme.False, "false", BrsBoolean.False),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses boolean ORs", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Identifier, "_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.True, "true", BrsBoolean.True),
                token(Lexeme.Or, "or"),
                token(Lexeme.False, "false", BrsBoolean.False),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
