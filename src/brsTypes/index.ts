import {
    ValueKind,
    BrsInvalid,
    BrsBoolean,
    BrsString,
    Uninitialized,
    Comparable,
    BrsValue,
} from "./BrsType";
import { RoArray } from "./components/RoArray";
import { RoDeviceInfo } from "./components/RoDeviceInfo";
import { RoAssociativeArray } from "./components/RoAssociativeArray";
import { Int32 } from "./Int32";
import { Int64 } from "./Int64";
import { Float } from "./Float";
import { Double } from "./Double";
import { Callable } from "./Callable";
import { BrsComponent } from "./components/BrsComponent";
import { RoString } from "./components/RoString";
import { BrsInterface } from "./BrsInterface";
import { RoSGNode } from "./components/RoSGNode";
import { Font } from "./components/Font";
import { Group } from "./components/Group";
import { Scene } from "./components/Scene";
import { MiniKeyboard } from "./components/MiniKeyboard";
import { TextEditBox } from "./components/TextEditBox";

export * from "./BrsType";
export * from "./Int32";
export * from "./Int64";
export * from "./Float";
export * from "./Double";
export * from "./BrsInterface";
export * from "./Callable";
export * from "./components/BrsComponent";
export * from "./components/RoDeviceInfo";
export * from "./components/ComponentFactory";
export * from "./components/RoArray";
export * from "./components/RoDateTime";
export * from "./components/RoAssociativeArray";
export * from "./components/Timespan";
export * from "./components/BrsObjects";
export * from "./components/RoRegex";
export * from "./components/RoXMLElement";
export * from "./components/RoString";
export * from "./components/RoBoolean";
export * from "./components/RoDouble";
export * from "./components/RoFloat";
export * from "./components/RoInt";
export * from "./components/RoLongInteger";
export * from "./components/RoInvalid";
export * from "./components/RoSGNodeEvent";
export * from "./components/RoSGNode";
export * from "./components/Group";
export * from "./components/Scene";
export * from "./components/MiniKeyboard";
export * from "./components/TextEditBox";
export * from "./components/LayoutGroup";
export * from "./components/Rectangle";
export * from "./components/Label";
export * from "./components/Font";
export * from "./components/Poster";
export * from "./components/ArrayGrid";
export * from "./components/MarkupGrid";
export * from "./components/ContentNode";
export * from "./components/Timer";

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
    return value.kind === ValueKind.String || value instanceof RoString;
}

/**
 * Determines whether or not the given value is a boolean.
 * @param value the BrightScript value in question.
 * @returns `true` if `value` if a boolean, otherwise `false`.
 */
export function isBrsBoolean(value: BrsType): value is BrsBoolean {
    return value.kind === ValueKind.Boolean;
}

/**
 * Determines whether or not the given value is a BrightScript callable.
 * @param value the BrightScript value in question.
 * @returns `true` if `value` is a Callable value, otherwise `false`.
 */
export function isBrsCallable(value: BrsType): value is Callable {
    return value.kind === ValueKind.Callable;
}

/**
 * Determines whether or not the provided value is an instance of a iterable BrightScript type.
 * @param value the BrightScript value in question.
 * @returns `true` if `value` can be iterated across, otherwise `false`.
 */
export function isIterable(value: BrsType): value is Iterable {
    return "get" in value && "getElements" in value && "set" in value;
}

/** The set of BrightScript numeric types. */
export type BrsNumber = Int32 | Int64 | Float | Double;

/**
 * The set of all comparable BrightScript types. Only primitive (i.e. intrinsic * and unboxed)
 * BrightScript types are comparable to each other.
 */
export type BrsPrimitive = BrsInterface | BrsInvalid | BrsBoolean | BrsString | BrsNumber;

/** The set of BrightScript iterable types. */
export type Iterable = RoArray | RoAssociativeArray;

// this is getting weird - we need a lesThan and greaterThan function?!
export type AllComponents = { kind: ValueKind.Object } & BrsComponent & BrsValue;

/** The set of all supported types in BrightScript. */
export type BrsType = BrsPrimitive | Iterable | Callable | AllComponents | Uninitialized;
