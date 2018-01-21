import { NumberKind, BrsNumber, IDouble, IInt32, IInt64, IFloat } from "./BrsNumber";
import { Int32 } from "./Int32";
import { Int64 } from "./Int64";
import { Float } from "./Float";

export class Double implements IDouble {
    readonly kind = NumberKind.Double;
    private readonly value: number;

    getValue(): number {
        return this.value;
    }

    /**
     * Creates a new BrightScript double-precision value representing the provided `value`.
     * @param value the value to store in the BrightScript double, rounded to 64-bit (double)
     *              precision.
     */
    constructor(value: number) {
        this.value = value;
    }

    /**
     * Creates a new BrightScript double-precision value representing the floating point value
     * contained in `asString`.
     * @param asString the string representation of the value to store in the BrightScript double.
     *                 Will be rounded to 64-bit (double) precision.
     * @returns a BrightScript double value representing `asString`.
     */
    static fromString(asString: string): Double {
        return new Double(Number.parseFloat(asString));
    }

    add(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int64:
                // TODO: Confirm that (double) + (int64) -> (double)
                return new Double(this.getValue() + rhs.getValue().toNumber());
            case NumberKind.Int32:
            case NumberKind.Float:
            case NumberKind.Double:
                return new Double(this.getValue() + rhs.getValue());
        }
    }

    subtract(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int64:
                // TODO: Confirm that (double) - (int64) -> (double)
                return new Double(this.getValue() - rhs.getValue().toNumber());
            case NumberKind.Int32:
            case NumberKind.Float:
            case NumberKind.Double:
                return new Double(this.getValue() - rhs.getValue());
        }
    }

    multiply(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int64:
                // TODO: Confirm that (double) - (int64) -> (double)
                return new Double(this.getValue() * rhs.getValue().toNumber());
            case NumberKind.Int32:
            case NumberKind.Float:
            case NumberKind.Double:
                return new Double(this.getValue() * rhs.getValue());
        }
    }

    divide(rhs: BrsNumber): IFloat | IDouble {
        switch (rhs.kind) {
            case NumberKind.Int64:
                // TODO: Confirm that (double) - (int64) -> (double)
                return new Double(this.getValue() / rhs.getValue().toNumber());
            case NumberKind.Int32:
            case NumberKind.Float:
            case NumberKind.Double:
                return new Double(this.getValue() / rhs.getValue());
        }
    }

    modulo(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int32:
            case NumberKind.Float:
            case NumberKind.Double:
                return new Double(this.getValue() % rhs.getValue());
            case NumberKind.Int64:
                return new Double(this.getValue() % rhs.getValue().toNumber());
        }
    }

    intDivide(rhs: BrsNumber): IInt32 | IInt64 {
        switch (rhs.kind) {
            case NumberKind.Int64:
                return new Int64(
                    Math.trunc(this.getValue() / rhs.getValue().toNumber())
                );
            case NumberKind.Int32:
            case NumberKind.Float:
            case NumberKind.Double:
                return new Int32(
                    Math.trunc(this.getValue() / rhs.getValue())
                );
        }
    }

    pow(exponent: BrsNumber): BrsNumber {
        switch (exponent.kind) {
            case NumberKind.Int32:
                return new Float(
                    Math.pow(this.getValue(), exponent.getValue())
                );
            case NumberKind.Int64:
                return new Int64(this.getValue()).pow(exponent);
            case NumberKind.Float:
                return new Float(
                    Math.pow(this.getValue(), exponent.getValue())
                );
            case NumberKind.Double:
                return new Double(
                    Math.pow(this.getValue(), exponent.getValue())
                );
        }
    }
}