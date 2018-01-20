import * as Long from "long";
import { NumberKind, BrsNumber, IInt32, IInt64, IFloat, IDouble } from "./BrsNumber";
import { Float } from "./Float";
import { Double } from "./Double";
import { Int32 } from "./Int32";

export class Int64 implements IInt64 {
    readonly kind = NumberKind.Int64;
    private readonly value: Long;

    getValue(): Long {
        return this.value;
    }

    /**
     * Creates a new BrightScript 64-bit integer value representing the provided `value`.
     * @param value the value to store in the BrightScript integer.
     */
    constructor(value: number | Long) {
        if (value instanceof Long) {
            this.value = value;
        } else {
            this.value = Long.fromNumber(
                Math.round(value)
            );
        }
    }

    /**
     * Creates a new BrightScript 64-bit integer value representing the integer contained in
     * `asString`.
     * @param asString the string representation of the value to store in the BrightScript 64-bit
     *                 int. Will be rounded to the nearest 64-bit integer.
     * @returns a BrightScript 64-bit integer value representing `asString`.
     */
    static fromString(asString: string): Int64 {
        let i64 = new Int64(Long.fromString(asString));
        const decimalLocation = asString.indexOf(".");
        if (decimalLocation > -1 && (decimalLocation + 1) < asString.length) {
            // Long.fromString truncates to integers instead of rounding, so manually add one to
            // compensate if necessary
            if (asString[decimalLocation + 1] >= "5" && asString[decimalLocation + 1] <= "9") {
                i64 = new Int64(i64.getValue().add(Long.ONE));
            }
        }
        return i64;
    }


    add(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int32:
            case NumberKind.Int64:
                return new Int64(this.getValue().add(rhs.getValue()));
            case NumberKind.Float:
                return new Float(this.getValue().toNumber() + rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue().toNumber() + rhs.getValue());
        }
    }

    subtract(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int32:
            case NumberKind.Int64:
                return new Int64(this.getValue().subtract(rhs.getValue()));
            case NumberKind.Float:
                return new Float(this.getValue().toNumber() - rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue().toNumber() - rhs.getValue());
        }
    }

    multiply(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int32:
            case NumberKind.Int64:
                return new Int64(this.getValue().multiply(rhs.getValue()));
            case NumberKind.Float:
                return new Float(this.getValue().toNumber() * rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue().toNumber() * rhs.getValue());
        }
    }

    divide(rhs: BrsNumber): IFloat | IDouble {
        switch (rhs.kind) {
            case NumberKind.Int32:
            case NumberKind.Int64:
                return new Float(this.getValue().divide(rhs.getValue()).toNumber());
            case NumberKind.Float:
                return new Float(this.getValue().toNumber() / rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue().toNumber() / rhs.getValue());
        }
    }

    modulo(rhs: BrsNumber): IInt32 | IInt64 {
        switch (rhs.kind) {
            case NumberKind.Int32:
            case NumberKind.Int64:
                return new Int64(this.getValue().modulo(rhs.getValue()));
            case NumberKind.Float:
                return new Int32(this.getValue().toNumber() % rhs.getValue());
            case NumberKind.Double:
                return new Int32(this.getValue().toNumber() % rhs.getValue());
        }
    }

    intDivide(rhs: BrsNumber): IInt32 | IInt64 {
        return new Double(this.getValue().toNumber()).intDivide(rhs);
    }

    pow(exponent: BrsNumber): BrsNumber {
        switch (exponent.kind) {
            case NumberKind.Int32:
                return new Int64(
                    Math.pow(this.getValue().toNumber(), exponent.getValue())
                );
            case NumberKind.Float:
                return new Float(
                    Math.pow(this.getValue().toNumber(), exponent.getValue())
                );
            case NumberKind.Double:
                return new Double(
                    Math.pow(this.getValue().toNumber(), exponent.getValue())
                );
            case NumberKind.Int64:
                return new Int64(
                    Math.pow(this.getValue().toNumber(), exponent.getValue().toNumber())
                );
        }
    }
}