import { BrsComponent } from "./components/BrsComponent";
import { BrsValue, BrsType, ValueKind } from "./";

export interface Boxable {
    box(): BrsType;
}

export interface Unboxable {
    unbox(): BrsType;
}

export function isBoxable(value: BrsValue): value is BrsValue & Boxable {
    return "box" in value;
}

export function isUnboxable(value: BrsValue): value is BrsValue & Unboxable {
    return "unbox" in value;
}
