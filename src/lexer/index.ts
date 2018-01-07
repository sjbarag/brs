import Long = require("long");

import { Lexeme } from "../Lexeme";
import { Token, Literal } from "../Token";
import { ReservedWords } from "../ReservedWords";
import * as BrsError from "../Error";
import { isAlpha, isDigit, isAlphaNumeric } from "./Characters";

/** The zero-indexed position at which the token under consideration begins. */
let start: number;
/** The zero-indexed position being examined for the token under consideration. */
let current: number;
/** The one-indexed line number being parsed. */
let line: number;

/** The BrightScript code being converted to an array of `Token`s. */
let source: string;
/** The tokens produced from `source`. */
let tokens: Token[];

/**
 * Converts a string containing BrightScript code to an array of `Token` objects that will later be
 * used to build an abstract syntax tree.
 *
 * @param toScan the BrightScript code to convert into tokens
 * @returns a (read-only) array of tokens to be passed to a parser.
 */
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

/**
 * Determines whether or not the lexer as reached the end of its input.
 * @returns `true` if the lexer has read to (or past) the end of its input, otherwise `false`.
 */
function isAtEnd() {
    return current >= source.length;
}

/**
 * Reads a non-deterministic number of characters from `source`, produces a `Token`, and adds it to
 * the `tokens` array.
 *
 * Accepts and returns nothing, because it's side-effect driven.
 */
function scanToken(): void {
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
        case ":": addToken(Lexeme.Colon); break;
        case "?": addToken(Lexeme.Print); break;
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
                BrsError.make(`Unexpected character '${c}'`, line);
            }
            break;
    }
}

/**
 * Reads and returns the next character from `string` while **moving the current position forward**.
 * @returns the new "current" character.
 */
function advance(): string {
    current++;
    return source.charAt(current - 1);
}

/**
 * Determines whether the "current" character matches an `expected` character and advances the
 * "current" character if it does.
 *
 * @param expected a single-character string to test for.
 * @returns `true` if `expected` is strictly equal to the current character, otherwise `false`
 *          (including if we've reached the end of the input).
 */
function match(expected: string) {
    if (expected.length > 1) {
        throw new Error(`Lexer#match expects a single character; received '${expected}'`);
    }

    if (isAtEnd()) { return false; }
    if (source.charAt(current) !== expected) { return false; }

    current++;
    return true;
}

/**
 * Returns the character at position `current` or a null character if we've reached the end of
 * input.
 *
 * @returns the current character if we haven't reached the end of input, otherwise a null
 *          character.
 */
function peek() {
    if (isAtEnd()) { return "\0" };
    return source.charAt(current);
}

/**
 * Returns the character after position `current`, or a null character if we've reached the end of
 * input.
 *
 * @returns the character after the current one if we haven't reached the end of input, otherwise a
 *          null character.
 */
function peekNext() {
    if (current + 1 > source.length) { return "\0"; }
    return source.charAt(current + 1);
}

/**
 * Reads characters within a string literal, advancing through escaped characters to the
 * terminating `"`, and adds the produced token to the `tokens` array. Creates a `BrsError` if the
 * string is terminated by a newline or the end of input.
 */
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
            BrsError.make("Unterminated string at end of line", line);
            return;
        }
        // if (peekNext() === "\"") { advance();}

        advance();
    }

    if (isAtEnd()) {
        // terminating a string with EOF is also not allowed
        BrsError.make("Unterminated string at end of file", line);
        return;
    }

    // move past the closing `"`
    advance();

    // trim the surrounding quotes, and replace the double-" literal with a single
    let value = source.slice(start + 1, current - 1).replace(/""/g, "\"");
    addToken(Lexeme.String, value);
}

/**
 * Reads characters within a number literal, advancing through fractional and exponential portions
 * as well as trailing type identifiers, and adds the produced token to the `tokens` array. Also
 * responsible for BrightScript's integer literal vs. float literal rules.
 *
 * @see https://sdkdocs.roku.com/display/sdkdoc/Expressions%2C+Variables%2C+and+Types#Expressions,Variables,andTypes-NumericLiterals
 */
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
        addToken(Lexeme.LongInteger, Long.fromString(asString));
        return;
    } else {
        // otherwise, it's a regular integer
        addToken(Lexeme.Integer, Number.parseInt(asString, 10));
        return;
    }
}

/**
 * Reads characters within an identifier, advancing through alphanumeric characters. Adds the
 * produced token to the `tokens` array.
 */
function identifier() {
    while (isAlphaNumeric(peek())) { advance(); }

    let text = source.slice(start, current);

    // TODO: support type designators:
    // https://sdkdocs.roku.com/display/sdkdoc/Expressions%2C+Variables%2C+and+Types

    let tokenType = ReservedWords[text.toLowerCase()] || Lexeme.Identifier;
    if (tokenType === ReservedWords.rem) {
        // The 'rem' keyword can be used to indicate comments as well, so
        // consume the rest of the line, but don't add the token; it's not
        // particularly useful.
        while (peek() !== "\n" && !isAtEnd()) { advance(); }
    } else {
        addToken(tokenType);
    }
}

/**
 * Creates a `Token` and adds it to the `tokens` array.
 * @param kind the type of token to produce.
 * @param literal an optional literal value to include in the token.
 */
function addToken(kind: Lexeme, literal?: Literal): void {
    tokens.push({
        kind: kind,
        text: source.slice(start, current),
        literal: literal,
        line: line
    });
}