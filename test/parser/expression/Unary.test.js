const Parser = require("../../../lib/parser");
const Expr = require("../../../lib/parser/Expression");
const { Lexeme } = require("../../../lib/Lexeme");
const BrsError = require("../../../lib/Error");

const { token, EOF } = require("../ParserTests");

describe("parser", () => {
    afterEach(() => BrsError.reset());

    describe("unary expressions", () => {
        it("parses unary 'not'", () => {
            let parsed = Parser.parse([
                token(Lexeme.Not),
                token(Lexeme.True),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses consecutive unary 'not'", () => {
            let parsed = Parser.parse([
                token(Lexeme.Not),
                token(Lexeme.Not),
                token(Lexeme.Not),
                token(Lexeme.Not),
                token(Lexeme.Not),
                token(Lexeme.True),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses unary '-'", () => {
            let parsed = Parser.parse([
                token(Lexeme.Minus),
                token(Lexeme.Integer, 5),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses consecutive unary '-'", () => {
            let parsed = Parser.parse([
                token(Lexeme.Minus),
                token(Lexeme.Minus),
                token(Lexeme.Minus),
                token(Lexeme.Minus),
                token(Lexeme.Minus),
                token(Lexeme.Integer, 5),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });
});
