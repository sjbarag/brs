import { Token, Lexeme } from "../lexer";
import { ParseError } from "../parser";
import * as CC from "./Chunk";

let current: number;
let tokens: ReadonlyArray<Token>;

export function parse(toParse: ReadonlyArray<Token>) {
    current = 0;
    tokens = toParse;


    try {
        return nChunks();
    } catch (conditionalCompilationError) {
        return [];
    }
}

function nChunks() {
    let chunks: CC.Chunk[] = [];

    while (!isAtEnd()) {
        let c = hashConst();
        if (c) {
            chunks.push(c);
        } else {
            break;
        }
    }

    return chunks;
}

function hashConst(): CC.Chunk | undefined {
    if (match(Lexeme.HashConst)) {
        let name = advance();
        consume("Expected '=' after #const (name)", Lexeme.Equal);
        let value = advance();
        match(Lexeme.Newline);
        return new CC.Declaration(name, value);
    }

    return hashIf();
}

function hashIf(): CC.Chunk | undefined {
    let startingLine = peek().line;

    if (match(Lexeme.HashIf)) {
        let elseChunk: CC.Chunk[] | undefined;

        let ifCondition = advance();
        match(Lexeme.Newline);

        let thenChunk = nChunks();

        let elseIfs: CC.HashElseIf[] = [];

        while (match(Lexeme.HashElseIf)) {
            let condition = advance();
            match(Lexeme.Newline);

            elseIfs.push({
                condition: condition,
                thenChunks: nChunks()
            });
        }

        if (match(Lexeme.HashElse)) {
            match(Lexeme.Newline);

            elseChunk = nChunks();
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

function hashError(): CC.Chunk | undefined {
    if (check(Lexeme.HashError)) {
        let hashError = advance();
        let message = advance();
        return new CC.Error(hashError, message.text || "");
    }

    return brightScriptChunk();
}

function brightScriptChunk(): CC.BrightScript | undefined {
    let chunkTokens: Token[] = [];
    while (!check(Lexeme.HashIf, Lexeme.HashElseIf, Lexeme.HashElse, Lexeme.HashEndIf, Lexeme.HashConst, Lexeme.HashError)) {
        chunkTokens.push(advance());

        if (isAtEnd()) {
            chunkTokens.push(peek());
            break;
        }
    }

    if (chunkTokens.length > 0) {
        return new CC.BrightScript(chunkTokens);
    } else {
        return undefined;
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

