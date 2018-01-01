const Parser = require("../../lib/parser");
const Expr = require("../../lib/parser/Expression");
const { Lexeme } = require("../../lib/Lexeme");
const OrbsError = require("../../lib/Error");

const { token, EOF } = require("./ParserTests");

describe("parser", () => {
    afterEach(() => OrbsError.reset());

    describe("exponentiation expressions", () => {
        it("parses exponentiation operators", () => {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 2),
                token(Lexeme.Caret),
                token(Lexeme.Integer, 3),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses repeated exponentiation as left-associative", () => {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 2),
                token(Lexeme.Caret),
                token(Lexeme.Integer, 3),
                token(Lexeme.Caret),
                token(Lexeme.Integer, 4),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });
});