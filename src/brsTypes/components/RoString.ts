import { BrsComponent } from "./BrsComponent";
import { RoArray } from "./RoArray";
import { BrsValue, ValueKind, BrsString } from "../BrsType";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { BrsType } from "..";

export class RoString extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;
    readonly value: string;

    public getValue(): string {
        return this.value;
    }

    constructor(initialValue: BrsString) {
        super("roString");

        this.value = initialValue.value;
        this.registerMethods([this.split]);
    }

    toString(_parent?: BrsType): string {
        return this.value;
    }

    private split = new Callable("split", {
        signature: {
            args: [new StdlibArgument("s", ValueKind.String)],
            returns: ValueKind.Object,
        },
        impl: (_interpreter: Interpreter, s: BrsString) => {
            return new RoArray(this.value.split(s.value).map(section => new BrsString(section)));
        },
    });
}
