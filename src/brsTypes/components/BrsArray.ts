import { BrsValue, ValueKind, BrsBoolean } from "../BrsType";
import { BrsType } from "..";
import { BrsComponent } from "./BrsComponent";

export class BrsArray implements BrsValue, BrsComponent {
    readonly kind = ValueKind.Array;

    constructor(readonly value: BrsType[]) { }

    toString() {
        return `roArray: ${JSON.stringify(this.value, undefined, 2)}`;
    }

    toJSON() {
        return this.toString();
    }

    lessThan(other: BrsType) {
        return BrsBoolean.False;
    }

    greaterThan(other: BrsType) {
        return BrsBoolean.False;
    }

    equalTo(other: BrsType) {
        if (other.kind === ValueKind.Array) {
            return BrsBoolean.from(this.value === other.value);
        }

        return BrsBoolean.False;
    }

    getValue() {
        return this.value;
    }
}