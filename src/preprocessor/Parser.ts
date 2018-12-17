import { Token, Lexeme } from "../lexer";
import { ParseError } from "../parser";
import * as CC from "./Chunk";

let current: number;
let tokens: ReadonlyArray<Token>;

export function parse(toParse: ReadonlyArray<Token>) {
    current = 0;
    tokens = toParse;

    let chunks: CC.Chunk[] = [];

    try {
        while (!isAtEnd()) {
            let c = hashConst();
            if (c) {
                chunks.push(c);
            }
        }

        return chunks;
    } catch (conditionalCompilationError) {
        return [];
    }
}

function hashConst(): CC.Chunk {
    if (match(Lexeme.HashConst)) {
        let name = advance();
        consume("Expected '=' after #const (name)", Lexeme.Equal);
        let value = advance();
        match(Lexeme.Newline);
        return new CC.Declaration(name, value);
    }

    return hashIf();
}

function hashIf(): CC.Chunk {
    let startingLine = peek().line;

    if (match(Lexeme.HashIf)) {
        let elseChunk: CC.Chunk | undefined;

        let ifCondition = advance();
        match(Lexeme.Newline);

        let thenChunk = chunk();

        let elseIfs: CC.HashElseIf[] = [];

        while (match(Lexeme.HashElseIf)) {
            match(Lexeme.Newline);

            elseIfs.push({
                condition: advance(),
                thenChunk: chunk()
            });
        }

        if (match(Lexeme.HashElse)) {
            match(Lexeme.Newline);

            elseChunk = chunk();
        }

        consume(
            `Expected '#else if' to close '#if' conditional compilation statement starting on line ${startingLine}`,
            Lexeme.HashEndIf
        );
        match(Lexeme.Newline);

        return new CC.If(ifCondition, thenChunk, elseIfs, elseChunk);
    }

    return hashError();
}

function hashError(): CC.Chunk {
    if (check(Lexeme.HashError)) {
        let hashError = advance();
        let message = advance();
        return new CC.Error(hashError, message.text || "");
    }

    return chunk();
}

function chunk(): CC.BrightScript {
    let chunkTokens: Token[] = [];
    while (!check(Lexeme.HashIf, Lexeme.HashElseIf, Lexeme.HashElse, Lexeme.HashEndIf, Lexeme.HashConst, Lexeme.HashError)) {
        chunkTokens.push(advance());

        if (isAtEnd()) {
            chunkTokens.push(peek());
            break;
        }
    }

    return new CC.BrightScript(chunkTokens);
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

