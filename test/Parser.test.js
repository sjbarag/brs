const Parser = require("../lib/parser");
const Expr = require("../lib/parser/Expression");
const { Lexeme } = require("../lib/Lexeme");
const OrbsError = require("../lib/Error");

function token(kind, literal) {
    return {
        kind: kind,
        literal: literal,
        line: 1
    };
}

const EOF = token(Lexeme.Eof);

describe("parser", () => {
    afterEach(() => OrbsError.reset());

    describe("primary expressions", () => {
        it("parses literals", () => {
            let numeric = Parser.parse([
                token(Lexeme.Integer, 5),
                EOF
            ]);
            expect(numeric).toEqual(new Expr.Literal(5));

            let parsedString = Parser.parse([
                token(Lexeme.String, "hello"),
                EOF
            ]);
            expect(parsedString).toEqual(new Expr.Literal("hello"));
        });

        it("parses identifiers");

        it("parses expressions in parentheses", () => {
            let withParens = Parser.parse([
                token(Lexeme.Integer, 1),
                token(Lexeme.Plus),
                token(Lexeme.LeftParen),
                token(Lexeme.Integer, 2),
                token(Lexeme.Star),
                token(Lexeme.Integer, 3),
                token(Lexeme.RightParen),
                EOF
            ]);
            expect(withParens).toBeDefined();
            expect(withParens).not.toBeNull();
            expect(withParens).toMatchSnapshot();
        });
    }); // primary expressions

    describe("exponentiation", () => {
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
    }); // exponentiation

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
    }); // unary expressions
}); // parser