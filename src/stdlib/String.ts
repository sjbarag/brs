import { BrsType, Callable, ValueKind, BrsString, Int32, Float } from "../brsTypes";
import * as Expr from "../parser/Expression";
import { Interpreter } from "../interpreter";
import { BrsNumber } from "../brsTypes/BrsNumber";

/** Converts the string to all uppercase. */
export const UCase = new Callable(
    "UCase",
    {
        signature: {
            args: [{name: "s", type: ValueKind.String}],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, s: BrsString) => new BrsString(s.value.toUpperCase())
    }
);

/** Converts the string to all lowercase. */
export const LCase = new Callable(
    "LCase",
    {
        signature: {
            args: [{name: "s", type: ValueKind.String}],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, s: BrsString) => new BrsString(s.value.toLowerCase())
    }
);

/**
 * Returns the Unicode ("ASCII") value for the first character of the specified string.
 * An empty string argument will return `0`.
 */
export const Asc = new Callable(
    "Asc",
    {
        signature: {
            args: [{name: "letter", type: ValueKind.String}],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, str: BrsString) => new Int32(str.value.charCodeAt(0) || 0)
    }
);

/**
 * Performs the inverse of the `Asc` function: returns a one-character string whose character has
 * the specified Unicode value.
 *
 * Returns empty string (`""`) if the specified value is `0` or an invalid Unicode value.
 */
export const Chr = new Callable(
    "Chr",
    {
        signature: {
            args: [{name: "ch", type: ValueKind.Int32}],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, ch: Int32) => {
            const num = ch.getValue();
            if (num <= 0) return new BrsString("");
            else return new BrsString(String.fromCharCode(num));
        }
    },
);

/**
 * Returns the first n characters in a string
 */
export const Left = new Callable(
    "Left",
    {
        signature: {
            args: [{name: "s", type: ValueKind.String}, {name: "n", type: ValueKind.Int32}],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, s: BrsString, n: Int32) => new BrsString(s.value.substr(0, n.getValue()))
    }
);

/**
 * Returns the last n characters in a string
 */
export const Right = new Callable(
    "Right",
    {
        signature: {
            args: [{name: "s", type: ValueKind.String}, {name: "n", type: ValueKind.Int32}],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, s: BrsString, n: Int32) => {
            let end = s.value.length - 1;
            let start = end - (n.getValue() - 1);

            if (n.getValue() <= 0) return new BrsString("");
            else if (start < 0) return new BrsString(s.value);
            return new BrsString(s.value.substr(start, end));
        }
    }
);

/**
 * Returns the index (1 based) of a string inside another string. Zero if there is no match.
 */
export const Instr = new Callable(
    "Instr",
    {
        signature: {
            args: [{name: "start", type: ValueKind.Int32}, {name: "str", type: ValueKind.String}, {name: "search", type: ValueKind.String}],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, start: Int32, str: BrsString, search: BrsString) => new Int32(str.value.indexOf(search.value, start.getValue() - 1) + 1)
    }
);

/**
 * Return the number of characters in a string
 */
export const Len = new Callable(
    "Len",
    {
        signature: {
            args: [{name: "s", type: ValueKind.String}],
            returns: ValueKind.Int32
        },
        impl: (interpreter: Interpreter, s: BrsString) => new Int32(s.value.length)
    }
);

/**
 * Return a string located in the middle of another string from start index to end index
 */
export const Mid = new Callable(
    "Mid",
    {
        signature: {
            args: [
                {
                    name: "s",
                    type: ValueKind.String
                },
                {
                    name: "p",
                    type: ValueKind.Int32
                }
            ],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, s: BrsString, p: Int32): BrsString => {
            let start = p.getValue() - 1;
            return new BrsString(s.value.substring(start));
        }
    },
    {
        signature: {
            args: [
                {
                    name: "s",
                    type: ValueKind.String
                },
                {
                    name: "p",
                    type: ValueKind.Int32
                },
                {
                    name: "n",
                    type: ValueKind.Int32
                }
            ],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, s: BrsString, p: Int32, n: Int32): BrsString => {
            let start = p.getValue() - 1;
            return new BrsString(s.value.substring(start, start + n.getValue()));
        }
    }
);

/**
 * Return a string from a float. If it is positive, prefix it with a space.
 */
export const Str = new Callable(
    "Str",
    {
        signature: {
            args: [{name: "value", type: ValueKind.Float}],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, value: Float): BrsString => {
            const floatValue = value.getValue();
            const prefix = (floatValue > 0.0) ? " " : "";
            return new BrsString(prefix + String(floatValue));
        }
    },
);

/**
 * Return a string from an integer. If it is positive, prefix it with a space.
 */
export const StrI = new Callable(
    "StrI",
    {
        signature: {
            args: [
                {
                    name: "value",
                    type: ValueKind.Int32
                },
                {
                    name: "radix",
                    type: ValueKind.Int32,
                    defaultValue: new Expr.Literal(new Int32(10))
                }
            ],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, value: Int32, brsRadix: Int32): BrsString => {
            let radix = brsRadix.getValue();
            if (radix < 2 || radix > 36) {
                return new BrsString("");
            }

            const intValue = value.getValue();
            const prefix = (intValue > 0 && radix === 10) ? " " : "";

            return new BrsString(prefix + intValue.toString(radix));
        }
    }
);

/**
 * Return a string from another string replacing instances of {index} with the 
 * respective parameter.
 */
export const Substitute = new Callable(
    "Substitute",
    {
        signature: {
            args: [
                {
                    name: "str",
                    type: ValueKind.String
                },
                {
                    name: "arg0",
                    type: ValueKind.String
                },
                {
                    name: "arg1",
                    type: ValueKind.String,
                    defaultValue: new Expr.Literal(new BrsString(""))
                },
                {
                    name: "arg2",
                    type: ValueKind.String,
                    defaultValue: new Expr.Literal(new BrsString(""))
                },
                {
                    name: "arg3",
                    type: ValueKind.String,
                    defaultValue: new Expr.Literal(new BrsString(""))
                },
            ],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, str: BrsString, arg0: BrsString, arg1: BrsString, arg2: BrsString, arg3: BrsString): BrsString => {
            let tmpStr = str.value;
            let replacements:{ [index:string]: BrsString } = { "0" : arg0, "1" : arg1, "2" : arg2, "3" : arg3 };
            for (const index in replacements) {
                let token = "\\{" + index + "\\}";
                tmpStr = tmpStr.replace(new RegExp(token, "g"), replacements[index].value);
            }

            return new BrsString(tmpStr);
        }
    }
);

/**
 * Return a float from a string
 */
export const Val = new Callable(
    "Val",
    {
        signature: {
            args: [
                {
                    name: "s", 
                    type: ValueKind.String
                },
                {
                    name: "radix",
                    type: ValueKind.Int32,
                    defaultValue: new Expr.Literal(new Int32(10))
                }
            ],
            returns: ValueKind.Dynamic
        },
        impl: (interpreter: Interpreter, s: BrsString, brsRadix: Int32): BrsNumber => {
            function isBrsStrFloat(str: BrsString): boolean {
                return str.value.includes(".");
            }

            if (isBrsStrFloat(s)) {
                return new Float(Number(s.value));
            } else {
                return new Int32(parseInt(s.value, brsRadix.getValue()));
            }
        }
    },
);

