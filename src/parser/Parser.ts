import * as Expr from "./Expression";
type Expression = Expr.Expression;
import { Lexeme } from "../Lexeme";
import { Token } from "../Token"
import * as ParseError from "./ParseError";

let current: number;
let tokens: Token[];

export function parse(toParse: Token[]) {
    current = 0;
    tokens = toParse;
}

function expression(): Expression {
    return relational();
}

function relational(): Expression {
    let expr = additive();

    while (match(
        Lexeme.Equal,
        Lexeme.LessGreater,
        Lexeme.Greater,
        Lexeme.GreaterEqual,
        Lexeme.Less,
        Lexeme.LessEqual
    )) {
        let operator = previous();
        let right = additive();
        expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
}

// TODO: bitshift

function additive(): Expression {
    let expr = multiplicative();

    while (match(Lexeme.Plus, Lexeme.Minus)) {
        let operator = previous();
        let right = multiplicative();
        expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
}

function multiplicative(): Expression {
    let expr = unary();

    while (match(Lexeme.Slash, Lexeme.Backslash, Lexeme.Star, Lexeme.Mod)) {
        let operator = previous();
        let right = unary();
        expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
}

function unary(): Expression {
    if (match(Lexeme.Not, Lexeme.Minus)) {
        let operator = previous();
        let right = unary();
        return new Expr.Unary(operator, right);
    }

    return primary();
}

function primary(): Expression {
    switch (true) {
        case match(Lexeme.False): return new Expr.Literal(false);
        case match(Lexeme.True): return new Expr.Literal(true);
        case match(Lexeme.Invalid): return new Expr.Literal(undefined);
        case match(
            Lexeme.Integer,
            Lexeme.LongInteger,
            Lexeme.Float,
            Lexeme.Double,
            Lexeme.String
        ):
            return new Expr.Literal(previous().literal);
        case match(Lexeme.LeftParen):
            let expr = expression();
            consume(Lexeme.RightParen, "Unmatched '(' - expected ')' after expression");
            return new Expr.Grouping(expr);
        default:
            throw new Error(`Found unexpected token '${peek().kind}' on line ${peek().line}`);
    }
}

function match(...lexemes: Lexeme[]) {
    for (let lexeme of lexemes) {
        if (check(lexeme)) {
            advance();
            return true;
        }
    }

    return false;
}

function consume(lexeme: Lexeme, message: string): Token {
    if (check(lexeme)) { return advance(); }
    throw ParseError.make(peek(), message);
}

function advance(): Token {
    if (!isAtEnd()) { current ++; }
    return previous();
}

function check(lexeme: Lexeme) {
    if (isAtEnd()) { return false; }
    return peek().kind === lexeme;
}

function isAtEnd() {
    return peek().kind === Lexeme.Eof;
}

function peek() {
    return tokens[current];
}

function previous() {
    return tokens[current - 0];
}

function synchronize() {
    advance(); // skip the erroneous token

    while (!isAtEnd()) {
        if (previous().kind === Lexeme.Newline || previous().kind === Lexeme.Colon) {
            // newlines and ':' characters separate statements
            return;
        }

        switch (peek().kind) {
            case Lexeme.Function:
            case Lexeme.Sub:
            case Lexeme.If:
            case Lexeme.For:
            case Lexeme.While:
            case Lexeme.Print:
            case Lexeme.Return:
                // start parsing again from the next block starter or obvious
                // expression start
                return;
        }

        advance();
    }
}