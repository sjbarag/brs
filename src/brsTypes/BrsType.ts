import { BrsType } from "./";

/** Set of values supported in BrightScript. */
export enum ValueKind {
    Invalid,
    Boolean,
    String,
    Int32,
    Int64,
    Float,
    Double
};

/** The base for all BrightScript types. */
export interface BrsValue {
    /** Type differentiator for all BrightScript values. */
    readonly kind: ValueKind;

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

    /**
     * Determines whether or not this value is equal to some `other` value.
     * @param other The value to compare this value to.
     * @returns `true` if this value is strictly equal to the `other` value, otherwise `false`.
     */
    equalTo(other: BrsType): BrsBoolean;

    /**
     * Converts the current value to a human-readable string.
     * @returns A human-readable representation of this value.
     */
    toString(): string;
}

/** Internal representation of a string in BrightScript. */
export class BrsString implements BrsValue {
    readonly kind = ValueKind.String;
    constructor(private readonly value: string) {}

    lessThan(other: BrsType): BrsBoolean {
        if (other.kind === ValueKind.String) {
            return BrsBoolean.from(this.value < other.value);
        }
        return BrsBoolean.False;
    }

    greaterThan(other: BrsType): BrsBoolean {
        if (other.kind === ValueKind.String) {
            return BrsBoolean.from(this.value > other.value);
        }
        return BrsBoolean.False;
    }

    equalTo(other: BrsType): BrsBoolean {
        if (other.kind === ValueKind.String) {
            return BrsBoolean.from(this.value === other.value);
        }
        return BrsBoolean.False;
    }

    toString() {
        return this.value;
    }

    concat(other: BrsString) {
        return new BrsString(this.value + other.value);
    }
}

/** Internal representation of a boolean in BrightScript. */
export class BrsBoolean implements BrsValue {
    readonly kind = ValueKind.Boolean;
    private constructor(private readonly value: boolean) {}

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

    toString() {
        return this.value.toString();
    }
}

/** Internal representation of the BrightScript `invalid` value. */
export class BrsInvalid implements BrsValue {
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

    toString() {
        return "invalid";
    }
}