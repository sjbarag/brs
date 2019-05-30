import { BrsValue, ValueKind, BrsString, BrsInvalid } from "../BrsType";
import { BrsComponent } from "./BrsComponent";
import { BrsType } from "..";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { Int32 } from "../Int32";

export class RoSGNode extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;

    constructor() {
        super("roSGNode");
    }

    toString(parent?: BrsType): string {
        return "<Component: roSGNode>";
    }
}

export function createNodeByType(type: BrsString) {
    if (type.value === "Node") {
        return new RoSGNode();
    } else {
        return BrsInvalid.Instance;
    }
}
