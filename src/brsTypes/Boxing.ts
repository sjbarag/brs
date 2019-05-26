import { BrsComponent } from "./components/BrsComponent";
import { BrsValue, BrsType, ValueKind } from "./";
import { RoString } from "./components/RoString";

export interface Boxable {
    box(): BrsComponent;
}

export interface Unboxable {
    unbox(): BrsValue;
}

export function isBoxable(value: BrsType): value is BrsType & Boxable {
    switch (value.kind) {
        case ValueKind.String:
            return true;
        default:
            return false;
    }
}

export function isUnboxable(value: BrsType): value is BrsType & Unboxable {
    return value instanceof BrsComponent && value.hasOwnProperty("unbox");
}
