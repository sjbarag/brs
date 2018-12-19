import { BrsValue, ValueKind, BrsString, BrsBoolean, BrsInvalid } from "../BrsType";
import { BrsComponent, BrsIterable } from "./BrsComponent";
import { BrsType } from "..";
import { Callable } from "../Callable";
import { Interpreter } from "../../interpreter";
import { Int32 } from "../Int32";

export class Timespan extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;
    private start = new Int32(Date.now());

    constructor() {
        super("roTimespan");
        this.registerMethods([
            this.mark,
            this.totalmilliseconds,
            this.totalseconds,
            this.getsecondstoiso8601date
        ]);

        this.resetTime();
    }

    resetTime() {
        this.start = new Int32(Date.now());
        console.log(this.start);
    }

    toString(parent?: BrsType): string {
        return "<Component: roTimespan>";
    }

    private mark = new Callable(
        "mark",
        {
            signature: {
                args: [],
                returns: ValueKind.Void
            },
            impl: (_: Interpreter) => {
                this.resetTime();
                return BrsInvalid.Instance;
            }
        }
    ); 
}
