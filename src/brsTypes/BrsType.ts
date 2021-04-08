import { BrsType } from ".";
import { Boxable } from "./Boxing";
import { RoString } from "./components/RoString";
import { Int32 } from "./Int32";
import { Float } from "./Float";
import { roBoolean } from "./components/RoBoolean";
import { roInvalid } from "./components/RoInvalid";
import { RoAssociativeArray } from "./components/RoAssociativeArray";
import { RoArray } from "./components/RoArray";

/** Set of values supported in BrightScript. */
export enum ValueKind {
    Interface,
    Invalid,
    Boolean,
    String,
    Int32,
    Int64,
    Float,
    Double,
    Callable,
    Uninitialized,
    Dynamic,
    Void,
    Object,
}

export namespace ValueKind {
    /**
     * Converts a `ValueKind` enum member to a human-readable string representation.
     * @returns a textual representation of the provided value kind.
     */
    export function toString(kind: ValueKind): string {
        switch (kind) {
            case ValueKind.Interface:
                return "Interface";
            case ValueKind.Invalid:
                return "Invalid";
            case ValueKind.Boolean:
                return "Boolean";
            case ValueKind.String:
                return "String";
            case ValueKind.Int32:
                return "Integer";
            case ValueKind.Int64:
                return "LongInteger";
            case ValueKind.Float:
                return "Float";
            case ValueKind.Double:
                return "Double";
            case ValueKind.Callable:
                return "Function";
            case ValueKind.Dynamic:
                return "Dynamic";
            case ValueKind.Void:
                return "Void";
            case ValueKind.Uninitialized:
                return "<uninitialized>";
            case ValueKind.Object:
                return "Object";
        }
    }

    /**
     * Fetches a `ValueKind` enum member by its string representation.
     * @param kind the string representation of a `ValueKind`
     * @returns the corresponding `ValueKind` if one exists, otherwise `undefined`.
     */
    export function fromString(kind: string): ValueKind | undefined {
        switch (kind.toLowerCase()) {
            case "interface":
                return ValueKind.Interface;
            case "invalid":
                return ValueKind.Invalid;
            case "boolean":
                return ValueKind.Boolean;
            case "string":
                return ValueKind.String;
            case "integer":
                return ValueKind.Int32;
            case "longinteger":
                return ValueKind.Int64;
            case "float":
                return ValueKind.Float;
            case "double":
                return ValueKind.Double;
            case "function":
                return ValueKind.Callable;
            case "dynamic":
                return ValueKind.Dynamic;
            case "void":
                return ValueKind.Void;
            case "<uninitialized>":
                return ValueKind.Uninitialized;
            case "object":
                return ValueKind.Object;
            default:
                return undefined;
        }
    }
}

/**
 * Converts the data type of a field to the appropriate value kind.
 * @param type data type of field
 */
export function getValueKindFromFieldType(type: string) {
    switch (type.toLowerCase()) {
        case "bool":
        case "boolean":
            return ValueKind.Boolean;
        case "int":
        case "integer":
            return ValueKind.Int32;
        case "longinteger":
            return ValueKind.Int64;
        case "float":
            return ValueKind.Float;
        case "uri":
        case "str":
        case "string":
            return ValueKind.String;
        case "function":
            return ValueKind.Callable;
        case "node":
        case "roarray":
        case "array":
        case "roassociativearray":
        case "assocarray":
            return ValueKind.Object;
        default:
            return ValueKind.Invalid;
    }
}

/**
 *  Converts a specified brightscript type in string into BrsType representation, with actual value
 *  Note: only native types are fully supported so far. Objects such as node/array/AA are created with default values,
 *  instead of the value that gets passed in.
 *  @param {string} type data type of field
 *  @param {string} value optional value specified as string
 *  @returns {BrsType} BrsType value representation of the type
 */
export function getBrsValueFromFieldType(type: string, value?: string): BrsType {
    let returnValue: BrsType;

    switch (type.toLowerCase()) {
        case "bool":
        case "boolean":
            returnValue = value ? BrsBoolean.from(value === "true") : BrsBoolean.False;
            break;
        case "node":
            returnValue = BrsInvalid.Instance;
            break;
        case "int":
        case "integer":
            returnValue = value ? new Int32(Number.parseInt(value)) : new Int32(0);
            break;
        case "float":
            returnValue = value ? new Float(Number.parseFloat(value)) : new Float(0);
            break;
        case "roarray":
        case "array":
            returnValue = new RoArray([]);
            break;
        case "roassociativearray":
        case "assocarray":
            returnValue = new RoAssociativeArray([]);
            break;
        case "uri":
        case "str":
        case "string":
            returnValue = value ? new BrsString(value) : new BrsString("");
            break;
        default:
            returnValue = Uninitialized.Instance;
            break;
    }

    return returnValue;
}

/** The base for all BrightScript types. */
export interface BrsValue {
    /**
     * Type differentiator for all BrightScript values. Used to allow comparisons of `.kind` to
     * produce valuable compile-time type inferences.
     */
    readonly kind: ValueKind;

    /**
     * Converts the current value to a human-readable string.
     * @param parent The (optional) BrightScript value that this value is being printed in the context of.
     * @returns A human-readable representation of this value.
     */
    toString(parent?: BrsType): string;

    /**
     * Determines whether or not this value is equal to some `other` value.
     * @param other The value to compare this value to.
     * @returns `true` if this value is strictly equal to the `other` value, otherwise `false`.
     */
    equalTo(other: BrsType): BrsBoolean;
}

/** The set of operations required for a BrightScript datatype to be compared to another. */
export interface Comparable {
    /**
     * Determines whether or not this value is less than some `other` value.
     * @param other The value to compare this value to.
     * @returns `true` if this value is less than the `other` value, otherwise `false`.
     */
    lessThan(other: BrsType): BrsBoolean;

    /**
     * Determines whether or not this value is greater than some `other` value.
     * @param other The value to compare this value to.
     * @returns `true` if this value is greater than the `other` value, otherwise `false`.
     */
    greaterThan(other: BrsType): BrsBoolean;
}

/** Internal representation of a string in BrightScript. */
export class BrsString implements BrsValue, Comparable, Boxable {
    readonly kind = ValueKind.String;
    constructor(readonly value: string) {}

    lessThan(other: BrsType): BrsBoolean {
        if (other.kind === ValueKind.String) {
            return BrsBoolean.from(this.value < other.value);
        } else if (other instanceof RoString) {
            return this.lessThan(other.unbox());
        }

        return BrsBoolean.False;
    }

    greaterThan(other: BrsType): BrsBoolean {
        if (other.kind === ValueKind.String) {
            return BrsBoolean.from(this.value > other.value);
        } else if (other instanceof RoString) {
            return this.greaterThan(other.unbox());
        }

        return BrsBoolean.False;
    }

    equalTo(other: BrsType): BrsBoolean {
        if (other.kind === ValueKind.String) {
            return BrsBoolean.from(this.value === other.value);
        } else if (other instanceof RoString) {
            return this.equalTo(other.unbox());
        }
        return BrsBoolean.False;
    }

    toString(parent?: BrsType) {
        if (parent) return `"${this.value}"`;
        return this.value;
    }

    concat(other: BrsString) {
        return new BrsString(this.value + other.value);
    }

    box() {
        return new RoString(this);
    }
}

/** Internal representation of a boolean in BrightScript. */
export class BrsBoolean implements BrsValue, Comparable, Boxable {
    readonly kind = ValueKind.Boolean;
    private constructor(private readonly value: boolean) {}

    toBoolean(): boolean {
        return this.value;
    }

    static False = new BrsBoolean(false);
    static True = new BrsBoolean(true);
    static from(value: boolean) {
        return value ? BrsBoolean.True : BrsBoolean.False;
    }

    lessThan(other: BrsType): BrsBoolean {
        // booleans aren't less than anything
        // TODO: Validate on a Roku
        return BrsBoolean.False;
    }

    greaterThan(other: BrsType): BrsBoolean {
        // but isn't greater than anything either
        // TODO: Validate on a Roku
        return BrsBoolean.False;
    }

    equalTo(other: BrsType): BrsBoolean {
        if (other.kind === ValueKind.Boolean) {
            return BrsBoolean.from(this === other);
        }
        return BrsBoolean.False;
    }

    toString(parent?: BrsType) {
        return this.value.toString();
    }

    box() {
        return new roBoolean(this);
    }

    /**
     * Returns the boolean AND of this value with another value.
     * @param other the other value to AND with this one.
     * @returns `BrsBoolean.True` if both this value and the other are true, otherwise
     *          `BrsBoolean.False`.
     */
    and(other: BrsBoolean): BrsBoolean {
        return BrsBoolean.from(this.value && other.value);
    }

    /**
     * Returns the boolean OR of this value with another value.
     * @param other the other value to AND with this one.
     * @returns `BrsBoolean.True` if either this value or the other are true, otherwise
     *          `BrsBoolean.False`.
     */
    or(other: BrsBoolean): BrsBoolean {
        return BrsBoolean.from(this.value || other.value);
    }

    /**
     * Returns the boolean negation of this value with another value.
     * @returns `BrsBoolean.True` if either this value is false, otherwise
     *          `BrsBoolean.False`.
     */
    not(): BrsBoolean {
        return BrsBoolean.from(!this.value);
    }
}

/** Internal representation of the BrightScript `invalid` value. */
export class BrsInvalid implements BrsValue, Comparable, Boxable {
    readonly kind = ValueKind.Invalid;
    static Instance = new BrsInvalid();

    lessThan(other: BrsType): BrsBoolean {
        // invalid isn't less than anything
        // TODO: Validate on a Roku
        return BrsBoolean.False;
    }

    greaterThan(other: BrsType): BrsBoolean {
        // but isn't greater than anything either
        // TODO: Validate on a Roku
        return BrsBoolean.False;
    }

    equalTo(other: BrsType): BrsBoolean {
        if (other.kind === ValueKind.Invalid) {
            return BrsBoolean.True;
        }
        return BrsBoolean.False;
    }

    toString(parent?: BrsType) {
        return "invalid";
    }

    box() {
        return new roInvalid();
    }
}

/** Internal representation of uninitialized BrightScript variables. */
export class Uninitialized implements BrsValue, Comparable {
    readonly kind = ValueKind.Uninitialized;
    static Instance = new Uninitialized();

    lessThan(other: BrsType): BrsBoolean {
        // uninitialized values aren't less than anything
        return BrsBoolean.False;
    }

    greaterThan(other: BrsType): BrsBoolean {
        // uninitialized values aren't less than anything
        return BrsBoolean.False;
    }

    equalTo(other: BrsType): BrsBoolean {
        if (other.kind === ValueKind.String) {
            // Allow variables to be compared to the string "<uninitialized>" to test if they've
            // been initialized
            return BrsBoolean.from(other.value === this.toString().toLowerCase());
        }

        return BrsBoolean.False;
    }

    toString(parent?: BrsType) {
        return "<UNINITIALIZED>";
    }
}
