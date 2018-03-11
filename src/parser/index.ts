import * as Expr from "./Expression";
type Expression = Expr.Expression;
import * as Stmt from "./Statement";
type Statement = Stmt.Statement;
import { Lexeme } from "../Lexeme";
import { Token } from "../Token"
import * as ParseError from "./ParseError";

import {
    BrsInvalid,
    BrsBoolean,
    BrsString,
    Int32
} from "../brsTypes";

/** Set of all keywords that end blocks. */
type BlockTerminator =
    Lexeme.ElseIf |
    Lexeme.Else |
    Lexeme.EndFor |
    Lexeme.EndIf |
    Lexeme.EndWhile |
    Lexeme.EndSub|
    Lexeme.EndFunction;

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
        synchronize();
        return;
    }
}

function assignment(...additionalterminators: Lexeme[]): Stmt.Assignment {
    let name = advance();
    consume("Expected '=' after idenfifier", Lexeme.Equal);
    // TODO: support +=, -=, >>=, etc.

    let value = expression();
    consume("Expected newline or ':' after assignment", Lexeme.Newline, Lexeme.Colon, Lexeme.Eof, ...additionalterminators);
    return new Stmt.Assignment(name, value);
}

function statement(...additionalterminators: BlockTerminator[]): Statement {
    if (match(Lexeme.If)) {
        return ifStatement();
    }

    if (match(Lexeme.Print)) {
        return printStatement(...additionalterminators);
    }

    if (match(Lexeme.While)) {
        return whileStatement();
    }

    if (match(Lexeme.For)) {
        return forStatement();
    }

    if (match(Lexeme.ExitFor)) { return exitFor(); }

    if (match(Lexeme.ExitWhile)) { return exitWhile(); }

    // TODO: support multi-statements
    return expressionStatement(...additionalterminators);
}

function whileStatement(): Stmt.While {
    const condition = expression();

    consume("Expected newline after 'while ...condition...'", Lexeme.Newline);
    const whileBlock = block(Lexeme.EndWhile);
    advance();
    while (match(Lexeme.Newline)) {}
    return new Stmt.While(condition, whileBlock);
}

function exitWhile(): Stmt.ExitWhile {
    consume("Expected newline after 'exit while'", Lexeme.Newline);
    while (match(Lexeme.Newline)) {}
    return new Stmt.ExitWhile();
}

function forStatement(): Stmt.For {
    const initializer = assignment(Lexeme.To);
    const finalValue = expression();
    let increment: Expression | undefined;

    if (match(Lexeme.Step)) {
        increment = expression();
    } else {
        // BrightScript for/to/step loops default to a step of 1 if no `step` is provided
        increment = new Expr.Literal(new Int32(1));
    }
    while(match(Lexeme.Newline)) {}

    let body = block(Lexeme.EndFor);
    advance();
    while(match(Lexeme.Newline)) {}

    // WARNING: BrightScript doesn't delete the loop initial value after a for/to loop! It just
    // stays around in scope with whatever value it was when the loop exited.
    return new Stmt.For(initializer, finalValue, increment, body);
}

function exitFor(): Stmt.ExitWhile {
    consume("Expected newline after 'exit while'", Lexeme.Newline);
    while (match(Lexeme.Newline)) {}
    return new Stmt.ExitFor();
}

function ifStatement(): Stmt.If {
    const startingLine = previous().line;

    const condition = expression();
    let thenBranch: Stmt.Block;
    let elseIfBranches: Stmt.ElseIf[] = [];
    let elseBranch: Stmt.Block | undefined;
    consume("Expected 'then' after 'if ...condition...", Lexeme.Then);

    if (match(Lexeme.Newline)) {
        // we're parsing a multi-line ("block") form of the BrightScript if/then/else and must find
        // a trailing "end if"

        thenBranch = block(Lexeme.EndIf, Lexeme.Else, Lexeme.ElseIf);
        match(Lexeme.Newline);

        // attempt to read a bunch of "else if" clauses
        while (match(Lexeme.ElseIf)) {
            let elseIfCondition = expression();
            consume("Expected 'then' after 'else if ...condition...'", Lexeme.Then);
            match(Lexeme.Newline);
            let elseIfThen = block(Lexeme.EndIf, Lexeme.Else, Lexeme.ElseIf);
            elseIfBranches.push({
                condition: elseIfCondition,
                thenBranch: elseIfThen
            });
        }

        if (match(Lexeme.Else)) {
            match(Lexeme.Newline);
            elseBranch = block(Lexeme.EndIf);
            advance(); // skip past "end if"
            match(Lexeme.Newline);
        } else {
            match(Lexeme.Newline);
            consume(
                `Expected 'end if' to close 'if' statement started on line ${startingLine}`,
                Lexeme.EndIf
            );
            match(Lexeme.Newline);
        }
    } else {
        let thenStatement = statement(Lexeme.ElseIf, Lexeme.Else);
        thenBranch = new Stmt.Block([thenStatement]);

        while(match(Lexeme.ElseIf)) {
            let elseIfCondition = expression();
            consume("Expected 'then' after 'else if ...condition...'", Lexeme.Then);
            let elseIfThen = statement(Lexeme.ElseIf, Lexeme.Else);
            elseIfBranches.push({
                condition: elseIfCondition,
                thenBranch: new Stmt.Block([elseIfThen])
            });
        }

        if (match(Lexeme.Else)) {
            let elseStatement = statement();
            elseBranch = new Stmt.Block([elseStatement]);
        }
    }

    return new Stmt.If(condition, thenBranch, elseIfBranches, elseBranch);
}

function expressionStatement(...additionalterminators: BlockTerminator[]): Stmt.Expression {
    let expr = expression();
    if (!check(...additionalterminators)) {
        consume("Expected newline or ':' after expression statement", Lexeme.Newline, Lexeme.Colon, Lexeme.Eof);
    }
    return new Stmt.Expression(expr);
}

function printStatement(...additionalterminators: BlockTerminator[]): Stmt.Expression {
    let value = expression();
    if (!check(...additionalterminators)) {
        consume("Expected newline or ':' after printed value", Lexeme.Newline, Lexeme.Colon, Lexeme.Eof);
    }
    return new Stmt.Print(value);
}

/**
 * Parses a block, looking for a specific terminating Lexeme to denote completion.
 * @param terminators the token(s) that signifies the end of this block; all other terminators are
 *                    ignored.
 */
function block(...terminators: BlockTerminator[]): Stmt.Block {
    const statements: Statement[] = [];
    while (!check(...terminators)) {
        const dec = declaration();
        if (dec) {
            statements.push(dec);
        }
    }
    return new Stmt.Block(statements);
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

    return call();
}

function call(): Expression {
    let expr = primary();

    while (true) {
        if (match(Lexeme.LeftParen)) {
            expr = finishCall(expr);
        } else {
            break;
        }
    }

    return expr;
}

function finishCall(callee: Expression): Expression {
    let args = [];
    if (!check(Lexeme.RightParen)) {
        // TODO: Add support for 'as $Type' suffix after each arg
        do {
            if (args.length >= Expr.Call.MaximumArguments) {
                ParseError.make(peek(), `Cannot have more than ${Expr.Call.MaximumArguments} arguments`);
            }
            args.push(expression());
        } while (match(Lexeme.Comma));
    }

    let closingParen = consume("Expected ')' after function call arguments", Lexeme.RightParen);

    return new Expr.Call(callee, closingParen, args);
}

function primary(): Expression {
    switch (true) {
        case match(Lexeme.False): return new Expr.Literal(BrsBoolean.False);
        case match(Lexeme.True): return new Expr.Literal(BrsBoolean.True);
        case match(Lexeme.Invalid): return new Expr.Literal(BrsInvalid.Instance);
        case match(
            Lexeme.Integer,
            Lexeme.LongInteger,
            Lexeme.Float,
            Lexeme.Double,
            Lexeme.String
        ):
            let p = previous();
            let lit = new Expr.Literal(p.literal!);
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

function check(...lexemes: Lexeme[]) {
    if (isAtEnd()) { return false; }

    return lexemes.some(lexeme => peek().kind === lexeme);
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