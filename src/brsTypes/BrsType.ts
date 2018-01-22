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
    lessThan(other: BrsValue): boolean;

    /**
     * Determines whether or not this value is greater than some `other` value.
     * @param other The value to compare this value to.
     * @returns `true` if this value is greater than the `other` value, otherwise `false`.
     */
    greaterThan(other: BrsValue): boolean;

    /**
     * Determines whether or not this value is equal to some `other` value.
     * @param other The value to compare this value to.
     * @returns `true` if this value is strictly equal to the `other` value, otherwise `false`.
     */
    equalTo(other: BrsValue): boolean;

    /**
     * Converts the current value to a human-readable string.
     * @returns A human-readable representation of this value.
     */
    toString(): string;
}

/** Internal representation of a string in BrightScript. */
export class BrsString implements BrsValue {
    readonly kind: ValueKind.String
    private readonly value: string;

    lessThan(other: BrsValue): boolean {
        if (other instanceof BrsString) {
            return this.value < other.value;
        }
        return false;
    }

    greaterThan(other: BrsValue): boolean {
        if (other instanceof BrsString) {
            return this.value > other.value;
        }
        return false;
    }

    equalTo(other: BrsValue): boolean {
        if (other instanceof BrsString) {
            return this.value === other.value;
        }
        return false;
    }

    toString() {
        return this.value;
    }
}

export interface IBrsBoolean extends BrsValue {
    readonly kind: ValueKind.Boolean;
}

/** Internal representation of a boolean in BrightScript. */
export class BrsBoolean implements BrsValue {
    readonly kind: ValueKind.Boolean;
    private readonly value: boolean;

    lessThan(other: BrsValue): boolean {
        // booleans aren't less than anything
        // TODO: Validate on a Roku
        return false;
    }

    greaterThan(other: BrsValue): boolean {
        // but isn't greater than anything either
        // TODO: Validate on a Roku
        return false;
    }

    equalTo(other: BrsValue): boolean {
        if (other instanceof BrsBoolean) {
            return this.value === other.value;
        }
        return false;
    }

    toString() {
        return this.value.toString();
    }
}

export interface IBrsInvalid extends BrsValue {
    readonly kind: ValueKind.Invalid;
}

/** Internal representation of the BrightScript `invalid` value. */
export class BrsInvalid implements BrsValue {
    readonly kind: ValueKind.Invalid;
    lessThan(other: BrsValue): boolean {
        // invalid isn't less than anything
        // TODO: Validate on a Roku
        return false;
    }

    greaterThan(other: BrsValue): boolean {
        // but isn't greater than anything either
        // TODO: Validate on a Roku
        return false;
    }

    equalTo(other: BrsValue): boolean {
        if (other instanceof BrsInvalid) {
            return true;
        }
        return false;
    }

    toString() {
        return "invalid";
    }
}