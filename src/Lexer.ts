import Int64 = require("node-int64");

import { Lexeme } from "./Lexeme";
import { Token, Literal } from "./Token";
import { ReservedWords } from "./ReservedWords";
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
    switch (c.toLowerCase()) {
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
        default:
            if (isDigit(c)) {
                number();
            } else if (isAlpha(c)) {
                identifier();
            } else {
                OrbsError.make(`Unexpected character '${c}'`, line);
            }
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

function isDigit(char: string) {
    if (char.length > 1) {
        throw new Error(`Lexer#isDigit expects a single character; received '${char}'`);
    }

    return char >= "0" && char <= "9";
}

function isAlpha(char: string) {
    if (char.length > 1) {
        throw new Error(`Lexer#isAlpha expects a single character; received '${char}'`);
    }

    let c = char.toLowerCase();
    return (c >= "a" && c <= "z") || c === "_";
}

function isAlphaNumeric(char: string) {
    if (char.length > 1) {
        throw new Error(`Lexer#isAlphaNumeric expects a single character; received '${char}'`);
    }

    return isAlpha(char) || isDigit(char);
}

function number() {
    let containsDecimal = false;
    while (isDigit(peek())) { advance(); }

    // look for a fractional portion
    if (peek() === "." && isDigit(peekNext())) {
        containsDecimal = true;

        // consume the "." parse the fractional part
        advance();

        // read the remaining digits
        while (isDigit(peek())) { advance(); }
    }

    let asString = source.slice(start, current);
    let numberOfDigits = containsDecimal ? asString.length - 1 : asString.length;

    if (numberOfDigits >= 10) {
        // numeric literals over 10 digits are automatically Doubles
        addToken(Lexeme.Double, Number.parseFloat(asString));
        return;
    } else if (peek() === "#") {
        // numeric literals ending with "#" are forced to Doubles
        advance();
        asString = source.slice(start, current);
        addToken(Lexeme.Double, Number.parseFloat(asString));
        return;
    } else if (peek().toLowerCase() === "d") {
        // literals that use "D" as the exponent are also automatic Doubles
        
        // consume the "D"
        advance();

        // exponents are optionally signed
        if (peek() === "+" || peek() === "-") {
            advance();
        }

        // consume the exponent
        while (isDigit(peek())) { advance(); }

        // replace the exponential marker with a JavaScript-friendly "e"
        asString = source.slice(start, current).replace(/[dD]/, "e");
        addToken(Lexeme.Double, Number.parseFloat(asString));
        return;
    }

    if (peek() === "!") {
        // numeric literals ending with "!" are forced to Floats
        advance();
        asString = source.slice(start, current);
        addToken(
            Lexeme.Float,
            Math.fround(Number.parseFloat(asString))
        );
        return;
    } else if (peek().toLowerCase() === "e") {
        // literals that use "E" as the exponent are also automatic Floats
        
        // consume the "E"
        advance();

        // exponents are optionally signed
        if (peek() === "+" || peek() === "-") {
            advance();
        }

        // consume the exponent
        while (isDigit(peek())) { advance(); }

        asString = source.slice(start, current);
        addToken(
            Lexeme.Float,
            Math.fround(Number.parseFloat(asString))
        );
        return;
    } else if (containsDecimal) {
        // anything with a decimal but without matching Double rules is a Float
        addToken(
            Lexeme.Float,
            Math.fround(Number.parseFloat(asString))
        );
        return;
    }

    if (peek() === "&") {
        // numeric literals ending with "&" are forced to LongIntegers
        advance();
    asString = source.slice(start, current);
        addToken(Lexeme.LongInteger, new Int64(asString));
        return;
    } else {
        // otherwise, it's a regular integer
        addToken(Lexeme.Integer, Number.parseInt(asString, 10));
        return;
    }
}

function identifier() {
    while (isAlphaNumeric(peek())) { advance(); }

    let text = source.slice(start, current);

    // TODO: support type designators:
    // https://sdkdocs.roku.com/display/sdkdoc/Expressions%2C+Variables%2C+and+Types

    let tokenType = ReservedWords[text.toLowerCase()] || Lexeme.Identifier;

    addToken(tokenType);

    if (tokenType === ReservedWords.rem) {
        // The 'rem' keyword can be used to indicate comments as well,
        // so consume the rest of the line.
        while (peek() !== "\n" && !isAtEnd()) { advance(); }
    }
}

function addToken(kind: Lexeme, literal?: Literal): void {
    tokens.push({
        kind: kind,
        text: source.slice(start, current),
        literal: literal,
        line: line
    });
}