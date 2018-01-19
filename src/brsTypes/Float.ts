import { NumberKind, BrsNumber, IFloat } from "./BrsNumber";
import { Int32 } from "./Int32";
import { Double } from "./Double";

export class Float implements IFloat {
    readonly kind = NumberKind.Float;
    private readonly value: number;

    getValue(): number {
        return this.value;
    }

    /**
     * Creates a new BrightScript floating-point value representing the provided `value`.
     * @param value the value to store in the BrightScript float, rounded to 32-bit floating point
     *              precision.
     */
    constructor(value: number) {
        this.value = Math.fround(value);
    }

    /**
     * Creates a new BrightScript floating-point value representing the floating point value
     * contained in `asString`.
     * @param asString the string representation of the value to store in the BrightScript float.
     *                 Will be rounded to 32-bit floating point precision.
     * @returns a BrightScript floating-point value representing `asString`.
     */
    static fromString(asString: string): Float {
        return new Float(Number.parseFloat(asString));
    }

    add(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int64:
                // TODO: Confirm that (double) + (int64) -> (double)
                return new Float(this.getValue() + rhs.getValue().toNumber());
            case NumberKind.Int32:
            case NumberKind.Float:
                return new Float(this.getValue() + rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue() + rhs.getValue());
        }
    }

    subtract(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int64:
                // TODO: Confirm that (float) - (int64) -> (float)
                return new Float(this.getValue() - rhs.getValue().toNumber());
            case NumberKind.Int32:
            case NumberKind.Float:
                return new Float(this.getValue() - rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue() - rhs.getValue());
        }
    }

    multiply(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int64:
                // TODO: Confirm that (float) * (int64) -> (float)
                return new Float(this.getValue() * rhs.getValue().toNumber());
            case NumberKind.Int32:
            case NumberKind.Float:
                return new Float(this.getValue() * rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue() * rhs.getValue());
        }
    }
    divide(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int64:
                // TODO: Confirm that (float) / (int64) -> (float)
                return new Float(this.getValue() / rhs.getValue().toNumber());
            case NumberKind.Int32:
            case NumberKind.Float:
                return new Float(this.getValue() / rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue() / rhs.getValue());
        }
    }
    modulo(rhs: BrsNumber): BrsNumber {
        throw new Error("Method not implemented.");
    }
    intDivide(rhs: BrsNumber): BrsNumber {
        throw new Error("Method not implemented.");
    }
    pow(exponent: BrsNumber): BrsNumber {
        throw new Error("Method not implemented.");
    }
}