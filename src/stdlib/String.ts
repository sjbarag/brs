import { BrsType, Callable, ValueKind, BrsString, BrsNumber, Int32, Int64 } from "../brsTypes";
import { Interpreter } from "../interpreter";

class UCaseCallable extends Callable {
    signature = {
        name: "UCase",
        args: [{ name: "s", type: ValueKind.String }]
    }

    call(interpreter: Interpreter, str: BrsString): BrsType {
        return new BrsString(str.value.toUpperCase());
    }
}

class LCaseCallable extends Callable {
    signature = {
        name: "LCase",
        args: [{ name: "s", type: ValueKind.String }]
    }

    call(interpreter: Interpreter, str: BrsString): BrsType {
        return new BrsString(str.value.toLowerCase());
    }
}

class AscCallable extends Callable {
    signature = {
        name: "Asc",
        args: [{ name: "letter", type: ValueKind.String }]
    }

    call(interpreter: Interpreter, str: BrsString): BrsType {
        return new Int32(str.value.charCodeAt(0) || 0);
    }
}

class ChrCallable extends Callable {
    signature = {
        name: "Chr",
        args: [{ name: "ch", type: ValueKind.Int32 }]
    }

    call(interpreter: Interpreter, value: Int32): BrsType {
        const num = value.getValue();
        if (num <= 0)
            return new BrsString("");
        else
            return new BrsString(String.fromCharCode(num));
    }
}

/** Converts the string to all uppercase. */
export const UCase: Callable = new UCaseCallable();

/** Converts the string to all lowercase. */
export const LCase: Callable = new LCaseCallable();

/**
 * Returns the Unicode ("ASCII") value for the first character of the specified string.
 * An empty string argument will return `0`.
 */
export const Asc: Callable = new AscCallable();

/**
 * Performs the inverse of the `Asc` function: returns a one-character string whose character has
 * the specified Unicode value.
 *
 * Returns empty string (`""`) if the specified value is `0` or an invalid Unicode value.
 */
export const Chr: Callable = new ChrCallable();