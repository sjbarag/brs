import Long = require("long");

/** The types of numbers supported in BrightScript. */
export enum NumberKind {
    /** A 32-bit integer. */
    Int32,
    /** A 64-bit integer. */
    Int64,
    /** A 32-bit floating point number. */
    Float,
    /** A 64-bit floating point number, or "double" in most languages. */
    Double
}

/** The set of operations available on a BrightScript numeric variable. */
export interface Numeric {
    /** Type differentiator for all numeric types. */
    readonly kind: NumberKind;

    /**
     * Returns the current value this instance represents.
     * @returns the current value contained in this instance.
     */
    getValue(): number | Long;

    /**
     * Adds `rhs` to the current number and returns the result.
     * @param rhs The right-hand side value to add to the current value.
     * @returns The current value + `rhs`, with precision matching `max(current, rhs)`.
     */
    add(rhs: BrsNumber): BrsNumber;

    /**
     * Subtracts `rhs` from the current number and returns the result.
     * @param rhs The right-hand side value to subtract from the current value.
     * @returns The current value - `rhs`, with precision matching `max(current, rhs)`.
     */
    subtract(rhs: BrsNumber): BrsNumber;

    /**
     * Multiplies the current number by `rhs` and returns the result.
     * @param rhs The right-hand side value to multiply the current value by.
     * @returns The current value * `rhs`, with precision matching `max(current, rhs)`.
     */
    multiply(rhs: BrsNumber): BrsNumber;

    /**
     * Divides the current number by `rhs` and returns the result.
     * @param rhs The right-hand side value to divide the current value by.
     * @returns The current value / `rhs`, with floating-point precision matching `max(current, rhs)`.
     */
    divide(rhs: BrsNumber): IFloat | IDouble;

    /**
     * Modulos the current number by `rhs`. I.e. divides the current number by `rhs` and returns
     * the *whole-number remainder* of the result.
     * @param rhs The right-hand side value to modulo the current value by.
     * @returns The current value MOD `rhs` with 64-bit integer precision if `rhs` is an Int64,
     *          otherwise 32-bit integer precision.
     */
    modulo(rhs: BrsNumber): IInt32 | IInt64;

    /**
     * Integer-divides the current number by `rhs`. I.e. divides the current number by `rhs` and
     * returns the *integral part* of the result.
     * @param rhs The right-hand side value to integer-divide the current value by.
     * @returns The current value \ `rhs` with 64-bit integer precision if `rhs` is an Int64,
     *          otherwise 32-bit integer precision.
     */
    intDivide(rhs: BrsNumber): IInt32 | IInt64;

    /**
     * Calculates the current value to the power of `exponent`.
     * @param exponent The exponent to take the current value to the power of.
     * @returns The current value ^ `exponent`, with precision matching `max(current, rhs)`.
     */
    pow(exponent: BrsNumber): BrsNumber;
}

export interface IInt32 extends Numeric {
    readonly kind: NumberKind.Int32;
    getValue(): number;
}

export interface IInt64 extends Numeric {
    readonly kind: NumberKind.Int64;
    getValue(): Long;
}

export interface IFloat extends Numeric {
    readonly kind: NumberKind.Float;
    getValue(): number;
}

export interface IDouble extends Numeric {
    readonly kind: NumberKind.Double;
    getValue(): number;
}

/** The union of all supported BrightScript number types. */
export type BrsNumber = IInt32 | IInt64 | IFloat | IDouble;