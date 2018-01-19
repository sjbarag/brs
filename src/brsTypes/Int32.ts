import { NumberKind, BrsNumber, IInt32, IInt64, IFloat, IDouble } from "./BrsNumber";
import { Float } from "./Float";
import { Double } from "./Double";
import { Int64 } from "./Int64";

export class Int32 implements IInt32 {
    readonly kind = NumberKind.Int32;
    private readonly value: number;

    getValue(): number {
        return this.value;
    }

    /**
     * Creates a new BrightScript 32-bit integer value representing the provided `value`.
     * @param value the value to store in the BrightScript number, rounded to the nearest 32-bit
     *              integer.
     */
    constructor(initialValue: number) {
        this.value = Math.round(initialValue);
    }

    /**
     * Creates a new BrightScript 32-bit integer value representing the integer contained in
     * `asString`.
     * @param asString the string representation of the value to store in the BrightScript 32-bit
     *                 int. Will be rounded to the nearest 32-bit integer.
     * @returns a BrightScript 32-bit integer value representing `asString`.
     */
    static fromString(asString: string): Int32 {
        return new Int32(Number.parseInt(asString));
    }

    add(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int32:
                return new Int32(this.getValue() + rhs.getValue());
            case NumberKind.Int64:
                return new Int64(rhs.getValue().add(this.getValue()));
            case NumberKind.Float:
                return new Float(this.getValue() + rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue() + rhs.getValue());
        }
    }

    subtract(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int32:
                return new Int32(this.getValue() - rhs.getValue());
            case NumberKind.Int64:
                return new Int64(rhs.getValue().subtract(this.getValue()));
            case NumberKind.Float:
                return new Float(this.getValue() - rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue() - rhs.getValue());
        }
    }

    multiply(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int32:
                return new Int32(this.getValue() * rhs.getValue());
            case NumberKind.Int64:
                return new Int64(rhs.getValue().multiply(this.getValue()));
            case NumberKind.Float:
                return new Float(this.getValue() * rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue() * rhs.getValue());
        }
    }

    divide(rhs: BrsNumber): IFloat | IDouble {
        switch (rhs.kind) {
            case NumberKind.Int32:
                return new Float(this.getValue() / rhs.getValue());
            case NumberKind.Int64:
                return new Float(
                    this.getValue() / rhs.getValue().toNumber()
                );
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