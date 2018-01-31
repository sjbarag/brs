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
export function isBrsNumber(value: BrsType): value is BrsNumber {
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

/**
 * Determines whether or not the given value is a string.
 * @param value the BrightScript value in question.
 * @returns `true` if `value` is a string, otherwise `false`.
 */
export function isBrsString(value: BrsType): value is BrsString {
    return value.kind === ValueKind.String;
}

/**
 * Determines whether or not the given value is a boolean.
 * @param value the BrightScript value in question.
 * @returns `true` if `value` if a boolean, otherwise `false`.
 */
export function isBrsBoolean(value: BrsType): value is BrsBoolean {
    return value.kind === ValueKind.Boolean;
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