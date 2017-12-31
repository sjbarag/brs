const { assert } = require("chai");

const Parser = require("../lib/parser");
const Expr = require("../lib/parser/Expression");
const { Lexeme } = require("../lib/Lexeme");

function token(kind, literal) {
    return {
        kind: kind,
        literal: literal,
        line: 1
    };
}

const EOF = token(Lexeme.Eof);

describe("parser", function() {
    context("primary expressions", function() {
        it("parses literals", function() {
            let numeric = Parser.parse([
                token(Lexeme.Integer, 5),
                EOF
            ]);

            assert.deepEqual(
                numeric,
                new Expr.Literal(5),
                "Must parse numeric literal tokens to literal AST nodes"
            );

            let parsedString = Parser.parse([
                token(Lexeme.String, "hello"),
                EOF
            ]);
            assert.deepEqual(
                parsedString,
                new Expr.Literal("hello"),
                "Must parse string literal tokens to literal AST nodes"
            );
        });

        it("parses identifiers");

        it("parses expressions in parentheses", function() {
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
            let expectedAst = new Expr.Binary(
                new Expr.Literal(1),
                token(Lexeme.Plus),
                new Expr.Grouping(
                    new Expr.Binary(
                        new Expr.Literal(2),
                        token(Lexeme.Star),
                        new Expr.Literal(3)
                    )
                )
            );
            assert.deepEqual(
                withParens,
                expectedAst,
                "Must parse paranthetic tokens into paranthetic AST nodes"
            );
        });
    }); // primary expressions

    context("exponentiation", function() {
        it("parses exponentiation operators", function() {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 2),
                token(Lexeme.Caret),
                token(Lexeme.Integer, 3),
                EOF
            ]);
            assert.deepEqual(
                parsed,
                new Expr.Binary(
                    new Expr.Literal(2),
                    token(Lexeme.Caret),
                    new Expr.Literal(3)
                ),
                "Must parse caret tokens into exponentiation AST nodes"
            );
        });

        it("parses repeated exponentiation as left-associative", function() {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 2),
                token(Lexeme.Caret),
                token(Lexeme.Integer, 3),
                token(Lexeme.Caret),
                token(Lexeme.Integer, 4),
                EOF
            ]);
            let expected = new Expr.Binary(
                new Expr.Binary(
                    new Expr.Literal(2),
                    token(Lexeme.Caret),
                    new Expr.Literal(3)
                ),
                token(Lexeme.Caret),
                new Expr.Literal(4),
            );

            assert.deepEqual(
                parsed,
                expected,
                "Must parse repeated '^'s into left-associative exponentials"
            );
        });
    }); // exponentiation

    context("unary expressions", function() {
        it("parses unary operators");
    }); // unary expressions
}); // parser