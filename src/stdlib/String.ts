import { BrsType, Callable, ValueKind, BrsString, Int32 } from "../brsTypes";
import { Interpreter } from "../interpreter";

/** Converts the string to all uppercase. */
export const UCase = new Callable(
    {
        name: "UCase",
        args: [{ name: "s", type: ValueKind.String }]
    },
    (interpreter: Interpreter, s: BrsString) => new BrsString(s.value.toUpperCase())
);

/** Converts the string to all lowercase. */
export const LCase = new Callable(
    {
        name: "LCase",
        args: [{ name: "s", type: ValueKind.String }]
    },
    (interpreter: Interpreter, s: BrsString) => new BrsString(s.value.toLowerCase())
);


/**
 * Returns the Unicode ("ASCII") value for the first character of the specified string.
 * An empty string argument will return `0`.
 */
export const Asc = new Callable(
    {
        name: "Asc",
        args: [{ name: "letter", type: ValueKind.String }]
    },
    (interpreter: Interpreter, str: BrsString) => new Int32(str.value.charCodeAt(0) || 0)
);

/**
 * Performs the inverse of the `Asc` function: returns a one-character string whose character has
 * the specified Unicode value.
 *
 * Returns empty string (`""`) if the specified value is `0` or an invalid Unicode value.
 */
export const Chr = new Callable(
    {
        name: "Chr",
        args: [{ name: "ch", type: ValueKind.Int32 }]
    },
    (interpreter: Interpreter, ch: Int32) => {
        const num = ch.getValue();
        if (num <= 0)
            return new BrsString("");
        else
            return new BrsString(String.fromCharCode(num));
    }
);