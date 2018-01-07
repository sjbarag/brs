const Parser = require("../../lib/parser");
const Expr = require("../../lib/parser/Expression");
const { Lexeme } = require("../../lib/Lexeme");
const BrsError = require("../../lib/Error");

const { token, EOF } = require("./ParserTests");

describe("parser", () => {
    afterEach(() => BrsError.reset());

    describe("boolean expressions", () => {
        it("parses boolean ANDs", () => {
            let parsed = Parser.parse([
                token(Lexeme.True),
                token(Lexeme.And),
                token(Lexeme.False),
                EOF
            ]);

            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses boolean ORs", () => {
            let parsed = Parser.parse([
                token(Lexeme.True),
                token(Lexeme.Or),
                token(Lexeme.False),
                EOF
            ]);

            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });
});