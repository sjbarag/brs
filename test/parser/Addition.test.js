const Parser = require("../../lib/parser");
const Expr = require("../../lib/parser/Expression");
const { Lexeme } = require("../../lib/Lexeme");
const OrbsError = require("../../lib/Error");

const { token, EOF } = require("./ParserTests");

describe("parser", () => {
    afterEach(() => OrbsError.reset());
    describe("addition expressions", () => {
        it("parses left-associative addition chains", () => {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 1),
                token(Lexeme.Plus),
                token(Lexeme.Integer, 2),
                token(Lexeme.Plus),
                token(Lexeme.Integer, 3),
                EOF
            ]);

            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses left-associative subtraction chains", () => {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 1),
                token(Lexeme.Minus),
                token(Lexeme.Integer, 2),
                token(Lexeme.Minus),
                token(Lexeme.Integer, 1),
                EOF
            ]);

            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });
});