import { EventEmitter } from "events";

import { Lexeme } from "./Lexeme";
import { Token, Location } from "./Token";
import { ReservedWords, KeyWords } from "./ReservedWords";
import { BrsError } from "../Error";
import { isAlpha, isDecimalDigit, isAlphaNumeric, isHexDigit } from "./Characters";

import { BrsType, BrsString, Int32, Int64, Float, Double } from "../brsTypes";

/** The results of a Lexer's scanning pass. */
interface ScanResults {
    /** The tokens produced by the Lexer. */
    tokens: Token[];
    /** The errors encountered by the Lexer. */
    errors: BrsError[];
}

export class Lexer {
    /** Allows consumers to observe errors as they're detected. */
    public readonly events = new EventEmitter();

    /**
     * A convenience function, equivalent to `new Lexer().scan(toScan)`, that converts a string
     * containing BrightScript code to an array of `Token` objects that will later be used to build
     * an abstract syntax tree.
     *
     * @param toScan the BrightScript code to convert into tokens
     * @param filename the name of the file to be scanned
     * @returns an object containing an array of `errors` and an array of `tokens` to be passed to a parser.
     */
    public static scan(toScan: string, filename: string = ""): ScanResults {
        return new Lexer().scan(toScan, filename);
    }

    /**
     * Convenience function to subscribe to the `err` events emitted by `lexer.events`.
     * @param errorHandler the function to call for every Lexer error emitted after subscribing
     * @returns an object with a `dispose` function, used to unsubscribe from errors
     */
    public onError(errorHandler: (err: BrsError) => void) {
        this.events.on("err", errorHandler);
        return {
            dispose: () => {
                this.events.removeListener("err", errorHandler);
            },
        };
    }

    /**
     * Convenience function to subscribe to a single `err` event emitted by `lexer.events`.
     * @param errorHandler the function to call for the first Lexer error emitted after subscribing
     */
    public onErrorOnce(errorHandler: (err: BrsError) => void) {
        this.events.once("err", errorHandler);
    }

    /**
     * The zero-indexed position at which the token under consideration begins.
     */
    private start = 0;
    /**
     * The zero-indexed position being examined for the token under consideration.
     */
    private current = 0;
    /**
     * The one-indexed line number being parsed.
     */
    private line = 1;
    /**
     * The zero-indexed column number being parsed.
     */
    private column = 0;

    /**
     * The BrightScript code being converted to an array of `Token`s.
     */
    private source = "";

    private filename = "";

    /**
     *
     * The tokens produced from `source`.
     */
    private tokens: Token[] = [];

    /**
     * The errors produced from `source.`
     */
    private errors: BrsError[] = [];

    private addError(err: BrsError) {
        this.errors.push(err);
        this.events.emit("err", err);
    }

    /**
     * Converts a string containing BrightScript code to an array of `Token` objects that will
     * later be used to build an abstract syntax tree.
     *
     * @param toScan the BrightScript code to convert into tokens
     * @param filename the name of the file to be scanned
     * @returns an object containing an array of `errors` and an array of `tokens` to be passed to a parser.
     */
    public scan(toScan: string, filename: string): ScanResults {
        this.source = toScan;
        this.filename = filename;
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.column = 0;
        this.tokens = [];
        this.errors = [];

        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push({
            kind: Lexeme.Eof,
            isReserved: false,
            text: "\0",
            location: {
                start: {
                    line: this.line,
                    column: this.column,
                },
                end: {
                    line: this.line,
                    column: this.column + 1,
                },
                file: filename,
            },
        });

        return {
            tokens: this.tokens,
            errors: this.errors,
        };
    }

    /**
     * Determines whether or not the lexer as reached the end of its input.
     * @returns `true` if the lexer has read to (or past) the end of its input, otherwise `false`.
     */
    private isAtEnd() {
        return this.current >= this.source.length;
    }

    /**
     * Reads a non-deterministic number of characters from `source`, produces a `Token`, and adds it to
     * the `tokens` array.
     *
     * Accepts and returns nothing, because it's side-effect driven.
     */
    private scanToken(): void {
        let c = this.advance();
        switch (c.toLowerCase()) {
            case "(":
                this.addToken(Lexeme.LeftParen);
                break;
            case ")":
                this.addToken(Lexeme.RightParen);
                break;
            case "{":
                this.addToken(Lexeme.LeftBrace);
                break;
            case "}":
                this.addToken(Lexeme.RightBrace);
                break;
            case "[":
                this.addToken(Lexeme.LeftSquare);
                break;
            case "]":
                this.addToken(Lexeme.RightSquare);
                break;
            case ",":
                this.addToken(Lexeme.Comma);
                break;
            case ".":
                // this might be a float/double literal, because decimals without a leading 0
                // are allowed
                if (isDecimalDigit(this.peek())) {
                    this.decimalNumber(true);
                } else {
                    this.addToken(Lexeme.Dot);
                }
                break;
            case "+":
                switch (this.peek()) {
                    case "=":
                        this.advance();
                        this.addToken(Lexeme.PlusEqual);
                        break;
                    case "+":
                        this.advance();
                        this.addToken(Lexeme.PlusPlus);
                        break;
                    default:
                        this.addToken(Lexeme.Plus);
                        break;
                }
                break;
            case "-":
                switch (this.peek()) {
                    case "=":
                        this.advance();
                        this.addToken(Lexeme.MinusEqual);
                        break;
                    case "-":
                        this.advance();
                        this.addToken(Lexeme.MinusMinus);
                        break;
                    default:
                        this.addToken(Lexeme.Minus);
                        break;
                }
                break;
            case "*":
                switch (this.peek()) {
                    case "=":
                        this.advance();
                        this.addToken(Lexeme.StarEqual);
                        break;
                    default:
                        this.addToken(Lexeme.Star);
                        break;
                }
                break;
            case "/":
                switch (this.peek()) {
                    case "=":
                        this.advance();
                        this.addToken(Lexeme.SlashEqual);
                        break;
                    default:
                        this.addToken(Lexeme.Slash);
                        break;
                }
                break;
            case "^":
                this.addToken(Lexeme.Caret);
                break;
            case "\\":
                switch (this.peek()) {
                    case "=":
                        this.advance();
                        this.addToken(Lexeme.BackslashEqual);
                        break;
                    default:
                        this.addToken(Lexeme.Backslash);
                        break;
                }
                break;
            case "=":
                this.addToken(Lexeme.Equal);
                break;
            case ":":
                this.addToken(Lexeme.Colon);
                break;
            case ";":
                this.addToken(Lexeme.Semicolon);
                break;
            case "?":
                this.addToken(Lexeme.Print);
                break;
            case "<":
                switch (this.peek()) {
                    case "=":
                        this.advance();
                        this.addToken(Lexeme.LessEqual);
                        break;
                    case "<":
                        this.advance();
                        switch (this.peek()) {
                            case "=":
                                this.advance();
                                this.addToken(Lexeme.LeftShiftEqual);
                                break;
                            default:
                                this.addToken(Lexeme.LeftShift);
                                break;
                        }
                        break;
                    case ">":
                        this.advance();
                        this.addToken(Lexeme.LessGreater);
                        break;
                    default:
                        this.addToken(Lexeme.Less);
                        break;
                }
                break;
            case ">":
                switch (this.peek()) {
                    case "=":
                        this.advance();
                        this.addToken(Lexeme.GreaterEqual);
                        break;
                    case ">":
                        this.advance();
                        switch (this.peek()) {
                            case "=":
                                this.advance();
                                this.addToken(Lexeme.RightShiftEqual);
                                break;
                            default:
                                this.addToken(Lexeme.RightShift);
                                break;
                        }
                        break;
                    default:
                        this.addToken(Lexeme.Greater);
                        break;
                }
                break;
            case "'":
                // BrightScript doesn't have block comments; only line
                while (this.peek() !== "\n" && !this.isAtEnd()) {
                    this.advance();
                }
                break;
            case " ":
            case "\r":
            case "\t":
                // ignore whitespace; indentation isn't signficant in BrightScript
                break;
            case "\n":
                // consecutive newlines aren't significant, because they're just blank lines
                // so only add blank lines when they're not consecutive
                let previous = this.lastToken();
                if (previous && previous.kind !== Lexeme.Newline) {
                    this.addToken(Lexeme.Newline);
                }
                // but always advance the line counter
                this.line++;
                // and always reset the column counter
                this.column = 0;
                break;
            case '"':
                this.string();
                break;
            case "#":
                this.preProcessedConditional();
                break;
            default:
                if (isDecimalDigit(c)) {
                    this.decimalNumber(false);
                } else if (c === "&" && this.peek().toLowerCase() === "h") {
                    this.advance(); // move past 'h'
                    this.hexadecimalNumber();
                } else if (isAlpha(c)) {
                    this.identifier();
                } else {
                    this.addError(new BrsError(`Unexpected character '${c}'`, this.locationOf(c)));
                }
                break;
        }
    }

    /**
     * Reads and returns the next character from `string` while **moving the current position forward**.
     * @returns the new "current" character.
     */
    private advance(): string {
        this.current++;
        this.column++;
        return this.source.charAt(this.current - 1);
    }

    /**
     * Determines whether the "current" character matches an `expected` character and advances the
     * "current" character if it does.
     *
     * @param expected a single-character string to test for.
     * @returns `true` if `expected` is strictly equal to the current character, otherwise `false`
     *          (including if we've reached the end of the input).
     */
    private match(expected: string) {
        if (expected.length > 1) {
            throw new Error(`Lexer#match expects a single character; received '${expected}'`);
        }

        if (this.isAtEnd()) {
            return false;
        }
        if (this.source.charAt(this.current) !== expected) {
            return false;
        }

        this.current++;
        return true;
    }

    /**
     * Returns the character at position `current` or a null character if we've reached the end of
     * input.
     *
     * @returns the current character if we haven't reached the end of input, otherwise a null
     *          character.
     */
    private peek() {
        if (this.isAtEnd()) {
            return "\0";
        }
        return this.source.charAt(this.current);
    }

    /**
     * Returns the character after position `current`, or a null character if we've reached the end of
     * input.
     *
     * @returns the character after the current one if we haven't reached the end of input, otherwise a
     *          null character.
     */
    private peekNext() {
        if (this.current + 1 > this.source.length) {
            return "\0";
        }
        return this.source.charAt(this.current + 1);
    }

    /**
     * Reads characters within a string literal, advancing through escaped characters to the
     * terminating `"`, and adds the produced token to the `tokens` array. Creates a `BrsError` if the
     * string is terminated by a newline or the end of input.
     */
    private string() {
        while (!this.isAtEnd()) {
            if (this.peek() === '"') {
                if (this.peekNext() === '"') {
                    // skip over two consecutive `"` characters to handle escaped `"` literals
                    this.advance();
                } else {
                    // otherwise the string has ended
                    break;
                }
            }

            if (this.peekNext() === "\n") {
                // BrightScript doesn't support multi-line strings
                this.addError(
                    new BrsError(
                        "Unterminated string at end of line",
                        this.locationOf(this.source.slice(this.start, this.current))
                    )
                );
                return;
            }

            this.advance();
        }

        if (this.isAtEnd()) {
            // terminating a string with EOF is also not allowed
            this.addError(
                new BrsError(
                    "Unterminated string at end of file",
                    this.locationOf(this.source.slice(this.start, this.current))
                )
            );
            return;
        }

        // move past the closing `"`
        this.advance();

        // trim the surrounding quotes, and replace the double-" literal with a single
        let value = this.source.slice(this.start + 1, this.current - 1).replace(/""/g, '"');
        this.addToken(Lexeme.String, new BrsString(value));
    }

    /**
     * Reads characters within a base-10 number literal, advancing through fractional and
     * exponential portions as well as trailing type identifiers, and adds the produced token
     * to the `tokens` array. Also responsible for BrightScript's integer literal vs. float
     * literal rules.
     * @param hasSeenDecimal `true` if decimal point has already been found, otherwise `false`
     *
     * @see https://sdkdocs.roku.com/display/sdkdoc/Expressions%2C+Variables%2C+and+Types#Expressions,Variables,andTypes-NumericLiterals
     */
    private decimalNumber(hasSeenDecimal: boolean) {
        let containsDecimal = hasSeenDecimal;
        while (isDecimalDigit(this.peek())) {
            this.advance();
        }

        // look for a fractional portion
        if (!hasSeenDecimal && this.peek() === ".") {
            containsDecimal = true;

            // consume the "." parse the fractional part
            this.advance();

            // read the remaining digits
            while (isDecimalDigit(this.peek())) {
                this.advance();
            }
        }

        let asString = this.source.slice(this.start, this.current);
        let numberOfDigits = containsDecimal ? asString.length - 1 : asString.length;
        let designator = this.peek().toLowerCase();

        if (numberOfDigits >= 10 && designator !== "&") {
            // numeric literals over 10 digits with no type designator are implicitly Doubles
            this.addToken(Lexeme.Double, Double.fromString(asString));
            return;
        } else if (designator === "#") {
            // numeric literals ending with "#" are forced to Doubles
            this.advance();
            asString = this.source.slice(this.start, this.current);
            this.addToken(Lexeme.Double, Double.fromString(asString));
            return;
        } else if (designator === "d") {
            // literals that use "D" as the exponent are also automatic Doubles

            // consume the "D"
            this.advance();

            // exponents are optionally signed
            if (this.peek() === "+" || this.peek() === "-") {
                this.advance();
            }

            // consume the exponent
            while (isDecimalDigit(this.peek())) {
                this.advance();
            }

            // replace the exponential marker with a JavaScript-friendly "e"
            asString = this.source.slice(this.start, this.current).replace(/[dD]/, "e");
            this.addToken(Lexeme.Double, Double.fromString(asString));
            return;
        }

        if (designator === "!") {
            // numeric literals ending with "!" are forced to Floats
            this.advance();
            asString = this.source.slice(this.start, this.current);
            this.addToken(Lexeme.Float, Float.fromString(asString));
            return;
        } else if (designator === "e") {
            // literals that use "E" as the exponent are also automatic Floats

            // consume the "E"
            this.advance();

            // exponents are optionally signed
            if (this.peek() === "+" || this.peek() === "-") {
                this.advance();
            }

            // consume the exponent
            while (isDecimalDigit(this.peek())) {
                this.advance();
            }

            asString = this.source.slice(this.start, this.current);
            this.addToken(Lexeme.Float, Float.fromString(asString));
            return;
        } else if (containsDecimal) {
            // anything with a decimal but without matching Double rules is a Float
            this.addToken(Lexeme.Float, Float.fromString(asString));
            return;
        }

        if (designator === "&") {
            // numeric literals ending with "&" are forced to LongIntegers
            asString = this.source.slice(this.start, this.current);
            this.advance();
            this.addToken(Lexeme.LongInteger, Int64.fromString(asString));
            return;
        } else {
            // otherwise, it's a regular integer
            this.addToken(Lexeme.Integer, Int32.fromString(asString));
            return;
        }
    }

    /**
     * Reads characters within a base-16 number literal, advancing through trailing type
     * identifiers, and adds the produced token to the `tokens` array. Also responsible for
     * BrightScript's integer literal vs. long-integer literal rules _for hex literals only_.
     *
     * @see https://sdkdocs.roku.com/display/sdkdoc/Expressions%2C+Variables%2C+and+Types#Expressions,Variables,andTypes-NumericLiterals
     */
    private hexadecimalNumber() {
        while (isHexDigit(this.peek())) {
            this.advance();
        }

        // fractional hex literals aren't valid
        if (this.peek() === "." && isHexDigit(this.peekNext())) {
            this.advance(); // consume the "."
            this.addError(
                new BrsError(
                    "Fractional hex literals are not supported",
                    this.locationOf(this.source.slice(this.start, this.current))
                )
            );
            return;
        }

        if (this.peek() === "&") {
            // literals ending with "&" are forced to LongIntegers
            this.advance();
            let asString = this.source.slice(this.start, this.current);
            this.addToken(Lexeme.LongInteger, Int64.fromString(asString));
        } else {
            let asString = this.source.slice(this.start, this.current);
            this.addToken(Lexeme.Integer, Int32.fromString(asString));
        }
    }

    /**
     * Reads characters within an identifier, advancing through alphanumeric characters. Adds the
     * produced token to the `tokens` array.
     */
    private identifier() {
        while (isAlphaNumeric(this.peek())) {
            this.advance();
        }

        let text = this.source.slice(this.start, this.current).toLowerCase();

        // some identifiers can be split into two words, so check the "next" word and see what we get
        if (
            (text === "end" || text === "else" || text === "exit" || text === "for") &&
            (this.peek() === " " || this.peek() === "\t")
        ) {
            let endOfFirstWord = {
                position: this.current,
                column: this.column,
            };

            // skip past any whitespace
            let whitespace = "";
            while (this.peek() === " " || this.peek() === "\t") {
                //keep the whitespace so we can replace it later
                whitespace += this.peek();
                this.advance();
            }
            while (isAlphaNumeric(this.peek())) {
                this.advance();
            } // read the next word

            let twoWords = this.source.slice(this.start, this.current);
            //replace all of the whitespace with a single space character so we can properly match keyword token types
            twoWords = twoWords.replace(whitespace, " ");
            let maybeTokenType = KeyWords[twoWords.toLowerCase()];
            if (maybeTokenType) {
                this.addToken(maybeTokenType);
                return;
            } else {
                // reset if the last word and the current word didn't form a multi-word Lexeme
                this.current = endOfFirstWord.position;
                this.column = endOfFirstWord.column;
            }
        }

        // look for a type designator character ($ % ! # &). vars may have them, but functions
        // may not. Let the parser figure that part out.
        let nextChar = this.peek();
        if (["$", "%", "!", "#", "&"].includes(nextChar)) {
            text += nextChar;
            this.advance();
        }

        let tokenType = KeyWords[text.toLowerCase()] || Lexeme.Identifier;
        if (tokenType === KeyWords.rem) {
            // The 'rem' keyword can be used to indicate comments as well, so
            // consume the rest of the line, but don't add the token; it's not
            // particularly useful.
            while (this.peek() !== "\n" && !this.isAtEnd()) {
                this.advance();
            }
        } else {
            this.addToken(tokenType);
        }
    }

    /**
     * Reads characters within an identifier with a leading '#', typically reserved for conditional
     * compilation. Adds the produced token to the `tokens` array.
     */
    private preProcessedConditional() {
        this.advance(); // advance past the leading #
        while (isAlphaNumeric(this.peek())) {
            this.advance();
        }

        let text = this.source.slice(this.start, this.current).toLowerCase();

        // some identifiers can be split into two words, so check the "next" word and see what we get
        if ((text === "#end" || text === "#else") && this.peek() === " ") {
            let endOfFirstWord = this.current;

            this.advance(); // skip past the space
            while (isAlphaNumeric(this.peek())) {
                this.advance();
            } // read the next word

            let twoWords = this.source.slice(this.start, this.current);
            switch (twoWords.replace(/ {2,}/g, " ")) {
                case "#else if":
                    this.addToken(Lexeme.HashElseIf);
                    return;
                case "#end if":
                    this.addToken(Lexeme.HashEndIf);
                    return;
            }

            // reset if the last word and the current word didn't form a multi-word Lexeme
            this.current = endOfFirstWord;
        }

        switch (text) {
            case "#if":
                this.addToken(Lexeme.HashIf);
                return;
            case "#else":
                this.addToken(Lexeme.HashElse);
                return;
            case "#elseif":
                this.addToken(Lexeme.HashElseIf);
                return;
            case "#endif":
                this.addToken(Lexeme.HashEndIf);
                return;
            case "#const":
                this.addToken(Lexeme.HashConst);
                return;
            case "#error":
                this.addToken(Lexeme.HashError);

                // #error must be followed by a message; scan it separately to preserve whitespace
                this.start = this.current;
                while (!this.isAtEnd() && this.peek() !== "\n") {
                    this.advance();
                }

                // grab all text since we found #error as one token
                this.addToken(Lexeme.HashErrorMessage);

                // consume the trailing newline here; it's not semantically significant
                this.match("\n");

                this.start = this.current;
                return;
            default:
                this.addError(
                    new BrsError(
                        `Found unexpected conditional-compilation string '${text}'`,
                        this.locationOf(this.source.slice(this.start, this.current))
                    )
                );
        }
    }

    /**
     * Retrieves the token that was most recently added.
     * @returns the most recently added token.
     */
    private lastToken(): Token | undefined {
        return this.tokens[this.tokens.length - 1];
    }

    /**
     * Creates a `Token` and adds it to the `tokens` array.
     * @param kind the type of token to produce.
     * @param literal an optional literal value to include in the token.
     */
    private addToken(kind: Lexeme, literal?: BrsType): void {
        let withWhitespace = this.source.slice(this.start, this.current);
        let text = withWhitespace.trimLeft() || withWhitespace;
        this.tokens.push({
            kind: kind,
            text: text,
            isReserved: ReservedWords.has(text.toLowerCase()),
            literal: literal,
            location: this.locationOf(text),
        });
    }

    /**
     * Creates a `TokenLocation` at the lexer's current position for the provided `text`.
     * @param text the text to create a location for
     * @returns the location of `text` as a `TokenLocation`
     */
    private locationOf(text: string): Location {
        return {
            start: {
                line: this.line,
                column: this.column - text.length,
            },
            end: {
                line: this.line,
                column: Math.max(this.column - text.length + 1, this.column),
            },
            file: this.filename,
        };
    }
}
