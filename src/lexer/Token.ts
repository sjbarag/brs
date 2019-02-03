import { Lexeme } from "./Lexeme";
import { BrsType } from "../brsTypes";

/**
 * Represents a chunk of BrightScript scanned by the lexer.
 */
export interface Token {
    /** The type of token this represents. */
    kind: Lexeme;
    /** The text found in the original BrightScript source, if any. */
    text: string;
    /** True if this token's `text` is a reserved word, otherwise `false`. */
    isReserved: boolean;
    /** The literal value (using the BRS type system) associated with this token, if any. */
    literal?: BrsType;
    /** Where the token was found. */
    location: TokenLocation
}

/** Represents the location at which a `Token` was found. */
export interface TokenLocation {
    /** The line and column at which this token began. */
    start: LineAndColumn,
    /** The line and column at which this token ended. */
    end: LineAndColumn,
    /** The name of the file in which this token was found. */
    file: string;
}

/** A line-column pair. */
type LineAndColumn = {
    line: number;
    column: number;
}

/** Represents an identifier as scanned by the lexer. */
export interface Identifier extends Token {
    kind: Lexeme.Identifier;
}
