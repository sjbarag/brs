import { ValueKind, BrsValue, BrsBoolean } from "./BrsType";
import { BrsComponent } from "./components/BrsComponent";

/**
 * A small typed wrapper around a BrightScript Interface.
 *
 * While BrightScript interfaces don't have any direct uses that I've found, their presence is useful in implementing reflection-based logic.
 */
export class BrsInterface implements BrsValue {
    readonly kind = ValueKind.Interface;
    constructor(readonly interfaceName: string) {}

    toString(): string {
        return `<Interface: ${this.interfaceName}>`;
    }

    equalTo(other: BrsValue): BrsBoolean {
        // interfaces are never equal to anything (they can't be compared, just like arrays)
        return BrsBoolean.False;
    }
}
