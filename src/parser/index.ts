import * as Expr from "./Expression";
type Expression = Expr.Expression;
import * as Stmt from "./Statement";
type Statement = Stmt.Statement;
import { Lexeme } from "../Lexeme";
import { Token } from "../Token"
import * as ParseError from "./ParseError";

let current: number;
let tokens: ReadonlyArray<Token>;

export function parse(toParse: ReadonlyArray<Token>) {
    current = 0;
    tokens = toParse;

    let statements: Statement[] = [];

    try {
        while (!isAtEnd()) {
            let dec = declaration();
            if (dec) {
                statements.push(dec);
            }
        }

        return statements;
    } catch (parseError) {
        return;
    }
}

function declaration(): Statement | undefined {
    try {
        // BrightScript is like python, in that variables can be declared without a `var`,
        // `let`, (...) keyword. As such, we must check the token *after* an identifier to figure
        // out what to do with it.
        if (check(Lexeme.Identifier) && checkNext(Lexeme.Equal)) {
            return assignment();
        }

        return statement();
    } catch (error) {
        return;
    }
}

function assignment(): Statement {
    let name = advance();
    consume("Expected '=' after idenfifier", Lexeme.Equal);
    // TODO: support +=, -=, >>=, etc.

    let value = expression();
    consume("Expected newline or ':' after assignment", Lexeme.Newline, Lexeme.Colon, Lexeme.Eof);
    return new Stmt.Assignment(name, value);
}

function statement(): Statement {
    if (match(Lexeme.Print)) {
        return printStatement();
    }

    // TODO: support multi-statements
    return expressionStatement();
}

function printStatement(): Statement {
    let value = expression();
    consume("Expected newline or ':' after printed value", Lexeme.Newline, Lexeme.Colon, Lexeme.Eof);
    return new Stmt.Print(value);
}

function expressionStatement(): Statement {
    let expr = expression();
    consume("Expected newline or ':' after expression statement", Lexeme.Newline, Lexeme.Colon, Lexeme.Eof);
    return new Stmt.Expression(expr);
}

function expression(): Expression {
    return boolean();
}

function boolean(): Expression {
    let expr = relational();

    while (match(Lexeme.And, Lexeme.Or)) {
        let operator = previous();
        let right = relational();
        expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
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
    let expr = exponential();

    while (match(Lexeme.Slash, Lexeme.Backslash, Lexeme.Star, Lexeme.Mod)) {
        let operator = previous();
        let right = exponential();
        expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
}

function exponential(): Expression {
    let expr = unary();

    while (match(Lexeme.Caret)) {
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
            let p = previous();
            let lit = new Expr.Literal(p.literal);
            return lit;
        case match(Lexeme.Identifier):
            return new Expr.Variable(previous());
        case match(Lexeme.LeftParen):
            let expr = expression();
            consume("Unmatched '(' - expected ')' after expression", Lexeme.RightParen);
            return new Expr.Grouping(expr);
        default:
            throw ParseError.make(peek(), `Found unexpected token '${peek().text}'`);
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

function consume(message: string, ...lexemes: Lexeme[]): Token {
    let foundLexeme = lexemes.map(lexeme => peek().kind === lexeme)
        .reduce(
            (foundAny, foundCurrent) => foundAny || foundCurrent,
            false
        );

    if (foundLexeme) { return advance(); }
    throw ParseError.make(peek(), message);
}

function advance(): Token {
    if (!isAtEnd()) { current++; }
    return previous();
}

function check(lexeme: Lexeme) {
    if (isAtEnd()) { return false; }
    return peek().kind === lexeme;
}

function checkNext(lexeme: Lexeme) {
    return peekNext().kind === lexeme;
}

function isAtEnd() {
    return peek().kind === Lexeme.Eof;
}

function peekNext() {
    if (isAtEnd()) { return peek(); }
    return tokens[current + 1];
}

function peek() {
    return tokens[current];
}

function previous() {
    return tokens[current - 1];
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