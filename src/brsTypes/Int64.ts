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
            this.value = Long.fromNumber(value);
        }
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
        return new Int64(this.getValue().divide(rhs.getValue()));
    }

    pow(exponent: BrsNumber): BrsNumber {
        switch (exponent.kind) {
            case NumberKind.Int32:
            case NumberKind.Float:
            case NumberKind.Double:
                return new Int64(
                    Math.pow(this.getValue().toNumber(), exponent.getValue())
                );
            case NumberKind.Int64:
                return new Int64(
                    Math.pow(this.getValue().toNumber(), exponent.getValue().toNumber())
                );
        }
    }
}