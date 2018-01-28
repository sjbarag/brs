import { ValueKind, BrsInvalid, BrsBoolean, BrsString } from "./BrsType";
import { Int32 } from "./Int32";
import { Int64 } from "./Int64";
import { Float } from "./Float";
import { Double } from "./Double";

export * from "./BrsType";
export * from "./Int32";
export * from "./Int64";
export * from "./Float"
export * from "./Double";

/**
 * Determines whether or not the given value is a number.
 * @param value the BrightScript value in question.
 * @returns `true` if `value` is a numeric value, otherwise `false`.
 */
export function isNumeric(value: BrsType): value is BrsNumber {
    switch (value.kind) {
        case ValueKind.Int32:
        case ValueKind.Int64:
        case ValueKind.Float:
        case ValueKind.Double:
            return true;
        default:
            return false;
    }
}

/** The set of BrightScript numeric types. */
export type BrsNumber = Int32 | Int64 | Float | Double;

/** The set of all supported types in BrightScript. */
export type BrsType =
    BrsInvalid |
    BrsBoolean |
    BrsString |
    Int32 |
    Int64 |
    Float |
    Double;