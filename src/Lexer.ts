import { Lexeme } from "./Lexeme";
import { Token } from "./Token";
import * as OrbsError from "./Error";

let start: number;
let current: number;
let line: number;

let source: string;
let tokens: Token[];

export function scan(toScan: string): ReadonlyArray<Token> {
    start = 0;
    current = 0;
    line = 1;

    source = toScan;
    tokens = [];

    while (!isAtEnd()) {
        start = current;
        scanToken();
    }

    tokens.push({
        kind: Lexeme.Eof,
        line: line
    });

    return tokens;
}

function isAtEnd() {
    return current >= source.length;
}

function scanToken() {
    let c = advance();
    switch (c) {
        case "(": addToken(Lexeme.LeftParen); break;
        case ")": addToken(Lexeme.RightParen); break;
        case "{": addToken(Lexeme.LeftBrace); break;
        case "}": addToken(Lexeme.RightBrace); break;
        case ",": addToken(Lexeme.Comma); break;
        case ".": addToken(Lexeme.Dot); break;
        case "+": addToken(Lexeme.Plus); break;
        case "-": addToken(Lexeme.Minus); break;
        case "*": addToken(Lexeme.Star); break;
        case "/": addToken(Lexeme.Slash); break;
        case "=": addToken(Lexeme.Equal); break;
        case "^": addToken(Lexeme.Caret); break;
        case "\\": addToken(Lexeme.Backslash); break;
        case "<": 
            switch (peek()) {
                case "=":
                    advance();
                    addToken(Lexeme.LessEqual);
                    break;
                case "<":
                    advance();
                    addToken(Lexeme.LeftShift);
                    break;
                case ">":
                    advance();
                    addToken(Lexeme.LessGreater);
                    break;
                default: addToken(Lexeme.Less); break;
            }
            break;
        case ">": 
            switch (peek()) {
                case "=":
                    advance();
                    addToken(Lexeme.GreaterEqual);
                    break;
                case ">":
                    advance();
                    addToken(Lexeme.RightShift);
                    break;
                default: addToken(Lexeme.Greater); break;
            }
            break;
        case "M":
        case "m":
            if (peek().toLowerCase() === "o" && peekNext().toLowerCase() === "d") {
                addToken(Lexeme.Mod);
                // move past the "o" and "d"
                advance();
                advance();
                break;
            } else {
                OrbsError.make(`Unexpected character '${c}'`, line);
                break;
            }
        case "'":
            // BrightScript doesn't have block comments; only line
            while (peek() !== "\n" && !isAtEnd()) { advance(); }
            break;
        case " ":
        case "\r":
        case "\t":
            // ignore whitespace; indentation isn't signficant in BrightScript
            break;
        case "\n":
            // but newlines _are_ important
            addToken(Lexeme.Newline);
            line++;
            break;
        case "\"":
            string();
            break;
        case "R":
        case "r":
            // brightscript allows the `rem` keyword to start comments in addition to
            // `'` prefixes
            if (peek().toLowerCase() === "e" && peekNext().toLowerCase() === "m") {
                // consume the rest of the line
                while (peek() !== "\n" && !isAtEnd()) { advance(); }
                break;
            } else{
                OrbsError.make(`Unexpected character '${c}'`, line);
                break;
            }
        default:
            OrbsError.make(`Unexpected character '${c}'`, line);
            break;
    }
}

function advance() {
    current++;
    return source.charAt(current - 1);
}

function match(expected: string) {
    if (expected.length > 1) {
        throw new Error(`Lexer#match expects a single character; received '${expected}'`);
    }

    if (isAtEnd()) { return false; }
    if (source.charAt(current) !== expected)  { return false; }

    current++;
    return true;
}

function peek() {
    if (isAtEnd()) { return "\0" };
    return source.charAt(current);
}

function peekNext() {
    if (current + 1 > source.length) { return "\0"; }
    return source.charAt(current + 1);
}

function string() {
    while (!isAtEnd()) {
        if (peek() === "\"") {
            if( peekNext() === "\"") {
                // skip over two consecutive `"` characters to handle escaped `"` literals
                advance();
            } else {
                // otherwise the string has ended
                break;
            }
        } 

        if (peekNext() === "\n") {
            // BrightScript doesn't support multi-line strings
            OrbsError.make("Unterminated string at end of line", line);
            return;
        }
        // if (peekNext() === "\"") { advance();}

        advance();
    }

    if (isAtEnd()) {
        // terminating a string with EOF is also not allowed
        OrbsError.make("Unterminated string at end of file", line);
        return;
    }

    // move past the closing `"`
    advance();

    // trim the surrounding quotes, and replace the double-" literal with a single
    let value = source.slice(start + 1, current - 1).replace(/""/g, "\"");
    addToken(Lexeme.String, value);
}

function addToken(kind: Lexeme, literal?: string): void {
    tokens.push({
        kind: kind,
        text: source.slice(start, current),
        literal: literal,
        line: line
    });
}