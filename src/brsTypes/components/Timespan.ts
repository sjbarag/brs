import { BrsValue, ValueKind, BrsString, BrsBoolean, BrsInvalid } from "../BrsType";
import { BrsComponent, BrsIterable } from "./BrsComponent";
import { BrsType, isBrsNumber } from "..";
import { Callable } from "../Callable";
import { Interpreter } from "../../interpreter";
import { Int32 } from "../Int32";
import { ftruncate } from "fs";

export class Timespan extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;
    private start = Date.now();

    constructor() {
        super("roTimespan");
        this.registerMethods([
            this.mark,
            this.totalmilliseconds,
            // this.totalseconds,
            // this.getsecondstoiso8601date
        ]);

        this.resetTime();
    }

    resetTime() {
        this.start = Date.now();
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

    private totalmilliseconds = new Callable(
        "totalmilliseconds",
        {
            signature: {
                args: [],
                returns: ValueKind.Int32
            },
            impl: (_: Interpreter) => {
               return new Int32(Date.now() - this.start);
            }
        }
    );
}
