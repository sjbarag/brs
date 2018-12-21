import { BrsValue, ValueKind, BrsString, BrsBoolean, BrsInvalid } from "../BrsType";
import { BrsComponent } from "./BrsComponent";
import { BrsType } from "..";
import { Callable } from "../Callable";
import { Interpreter } from "../../interpreter";
import { Int32 } from "../Int32";
import * as luxon from "luxon";

export class Timespan extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;
    private now = Date.now();

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
        this.now = Date.now();
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
                return new Int32(Date.now() - this.now);
            }
        }
    );

    private totalseconds = new Callable(
        "totalseconds",
        {
            signature: {
                args: [],
                returns: ValueKind.Int32
            },
            impl: (_: Interpreter) => {
                return new Int32((Date.now() - this.now) / 1000);
            }
        }
    );

    private getsecondstoiso8601date = new Callable(
        "getsecondstoiso8601date",
        {
            signature: {
                args: [
                    { name: "date", type: ValueKind.String }
                ],
                returns: ValueKind.Int32
            },
            impl: (_: Interpreter, date: BrsString) => {
                let dateToParse = luxon.DateTime.fromISO(date.value, { zone: "utc" });
                let msDate = dateToParse.millisecond;
                let now = Date.now();

                return dateToParse.isValid ? new Int32(msDate - now) : new Int32(2077252342);
            }
        }
    );
}
