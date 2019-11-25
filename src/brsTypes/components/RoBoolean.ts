import { BrsComponent } from "./BrsComponent";
import { BrsValue, ValueKind, BrsString, BrsBoolean, BrsInvalid } from "../BrsType";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { BrsType } from "..";
import { Unboxable } from "../Boxing";

export class roBoolean extends BrsComponent implements BrsValue, Unboxable {
    readonly kind = ValueKind.Object;
    private intrinsic: BrsBoolean;

    public getValue(): BrsBoolean {
        return this.intrinsic;
    }

    constructor(initialValue: BrsBoolean) {
        super("roBoolean", ["ifBoolean", "ifToStr"]);

        this.intrinsic = initialValue;
        this.registerMethods([this.getBoolean, this.setBoolean, this.toStr]);
    }

    unbox() {
        return this.intrinsic;
    }

    equalTo(other: BrsType): BrsBoolean {
        if (other instanceof roBoolean) {
            return BrsBoolean.from(other.getValue().toBoolean() === this.intrinsic.toBoolean());
        }

        return BrsBoolean.False;
    }

    toString(_parent?: BrsType): string {
        return this.intrinsic.toString();
    }

    // -------------- ifBoolean -------------- //

    private getBoolean = new Callable("getBoolean", {
        signature: {
            args: [],
            returns: ValueKind.Boolean,
        },
        impl: (interpreter: Interpreter) => {
            return this.intrinsic;
        },
    });

    private setBoolean = new Callable("setBoolean", {
        signature: {
            args: [new StdlibArgument("value", ValueKind.Boolean)],
            returns: ValueKind.Void,
        },
        impl: (_interpreter, value: BrsBoolean) => {
            this.intrinsic = value;
            return BrsInvalid.Instance;
        },
    });

    // -------------- ifToStr --------------

    private toStr = new Callable("toStr", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            return new BrsString(this.intrinsic.toString());
        },
    });
}
