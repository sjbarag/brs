const Parser = require("../../../lib/parser");
const { Lexeme } = require("../../../lib/Lexeme");
const BrsError = require("../../../lib/Error");

const { token, EOF } = require("../ParserTests");

describe("parser", () => {
    afterEach(() => BrsError.reset());

    describe("exponential expressions", () => {
        it("parses exponential operators", () => {
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

        it("parses repeated exponential operators as left-associative", () => {
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