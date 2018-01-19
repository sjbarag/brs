import Long = require("long");
import { NumberKind, BrsNumber, IInt64 } from "./BrsNumber";
import { Float } from "./Float";
import { Double } from "./Double";

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

    divide(rhs: BrsNumber): BrsNumber {
        switch (rhs.kind) {
            case NumberKind.Int32:
            case NumberKind.Int64:
                return new Int64(this.getValue().divide(rhs.getValue()));
            case NumberKind.Float:
                return new Float(this.getValue().toNumber() / rhs.getValue());
            case NumberKind.Double:
                return new Double(this.getValue().toNumber() / rhs.getValue());
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