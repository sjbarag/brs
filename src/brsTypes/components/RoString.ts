import { BrsComponent } from "./BrsComponent";
import { RoArray } from "./RoArray";
import { BrsValue, ValueKind, BrsString, BrsBoolean } from "../BrsType";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { BrsType } from "..";
import { Unboxable } from "../Boxing";

export class RoString extends BrsComponent implements BrsValue, Unboxable {
    readonly kind = ValueKind.Object;
    readonly intrinsic: BrsString;

    public getValue(): string {
        return this.intrinsic.value;
    }

    constructor(initialValue: BrsString) {
        super("roString");

        this.intrinsic = initialValue;
        this.registerMethods([this.split]);
    }

    equalTo(other: BrsType): BrsBoolean {
        if (other.kind === ValueKind.String) {
            return BrsBoolean.from(other.box().intrinsic === this.intrinsic);
        }

        if (other instanceof RoString) {
            return BrsBoolean.from(other.intrinsic === this.intrinsic);
        }

        return BrsBoolean.False;
    }

    unbox() {
        return this.intrinsic;
    }

    toString(_parent?: BrsType): string {
        return this.intrinsic.toString();
    }

    private split = new Callable("split", {
        signature: {
            args: [new StdlibArgument("s", ValueKind.String)],
            returns: ValueKind.Object,
        },
        impl: (_interpreter: Interpreter, s: BrsString) => {
            return new RoArray(
                this.intrinsic.value.split(s.value).map(section => new BrsString(section))
            );
        },
    });
}
