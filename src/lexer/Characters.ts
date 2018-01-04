/**
 * Determines whether or not a single-character string is a digit.
 *
 * @param char a single-character string that might contain a digit.
 * @returns `true` if `char` is between 0 and 9 (inclusive), otherwise `false`.
 */
export function isDigit(char: string) {
    if (char.length > 1) {
        throw new Error(`Lexer#isDigit expects a single character; received '${char}'`);
    }

    return char >= "0" && char <= "9";
}

/**
 * Determines whether a single-character string is alphabetic (or `_`).
 *
 * @param char a single-character string that might contain an alphabetic character.
 * @returns `true` if `char` is between "a" and "z" or "A" and "Z" (inclusive), or is `_`,
 *          otherwise false.
 */
export function isAlpha(char: string) {
    if (char.length > 1) {
        throw new Error(`Lexer#isAlpha expects a single character; received '${char}'`);
    }

    let c = char.toLowerCase();
    return (c >= "a" && c <= "z") || c === "_";
}

/**
 * Determines whether a single-character string is alphanumeric (or `_`).
 *
 * @param char a single-character string that might contain an alphabetic or numeric character.
 * @returns `true` if `char` is alphabetic, numeric, or `_`, otherwise `false`.
 */
export function isAlphaNumeric(char: string) {
    if (char.length > 1) {
        throw new Error(`Lexer#isAlphaNumeric expects a single character; received '${char}'`);
    }

    return isAlpha(char) || isDigit(char);
}