import { BrsValue, ValueKind, BrsString, BrsBoolean, BrsInvalid, Comparable } from "../BrsType";
import { BrsComponent } from "./BrsComponent";
import { BrsType } from "..";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { Int32 } from "../Int32";
import * as luxon from "luxon";
import * as dateFns from "date-fns";

export class RoDateTime extends BrsComponent implements BrsValue, Comparable {
    readonly kind = ValueKind.Object;
    private dateTime: Date;

    private formatOptions: { [id: string]: string } = {
        "long-date": "dddd MMMM D, YYYY",
        "short-weekday": "dd MMMM D, YYYY",
        "no-weekday": "MMMM D, YYYY",
        "short-month": "dddd MMM D, YYYY",
        "short-month-short-weekday": "dd MMM D, YYYY",
        "short-month-no-weekday": "MMM D, YYYY",
        "short-date": "M/D/YY",
        "short-date-dashes": "M-D-YY",
    };

    constructor() {
        super("roDateTime", ["ifDateTime"]);
        this.dateTime = new Date();

        this.registerMethods([
            this.mark,
            this.toLocalTime,
            this.getTimeZoneOffset,
            this.asSeconds,
            this.fromSeconds,
            this.toISOString,
            this.fromISO8601String,
            this.asDateString,
            /*
            this.asDateStringNoParam,
            this.getWeekday,
            this.getYear,
            this.getMonth,
            this.getDayOfMonth,
            this.getHours,
            this.getMinutes,
            this.getSeconds,
            this.getMilliseconds,
            this.getLastDayOfMonth,
            this.getDayOfWeek
            */
        ]);
    }

    public getValue(): Date {
        return this.dateTime;
    }

    equalTo(other: BrsType): BrsBoolean {
        return BrsBoolean.False;
    }

    lessThan(other: BrsType): BrsBoolean {
        return BrsBoolean.False;
    }

    greaterThan(other: BrsType): BrsBoolean {
        return BrsBoolean.False;
    }

    toString(parent?: BrsType): string {
        return "<Component: roDateTime>";
    }

    private mark = new Callable("mark", {
        signature: {
            args: [],
            returns: ValueKind.Invalid,
        },
        impl: (interpreter: Interpreter) => {
            this.dateTime = new Date();
            return BrsInvalid.Instance;
        },
    });

    private toLocalTime = new Callable("toLocalTime", {
        signature: {
            args: [],
            returns: ValueKind.Invalid,
        },
        impl: (interpreter: Interpreter) => {
            /** TODO: Implement toLocalTime */
            return BrsInvalid.Instance;
        },
    });

    private getTimeZoneOffset = new Callable("getTimeZoneOffset", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (interpreter: Interpreter) => {
            return new Int32(this.dateTime.getTimezoneOffset());
        },
    });

    private asSeconds = new Callable("asSeconds", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (interpreter: Interpreter) => {
            return new Int32(this.dateTime.getTime() / 1000);
        },
    });

    private fromSeconds = new Callable("fromSeconds", {
        signature: {
            args: [new StdlibArgument("numSeconds", ValueKind.Int32)],
            returns: ValueKind.Invalid,
        },
        impl: (_: Interpreter, seconds: Int32) => {
            let milliseconds = seconds.getValue() * 1000;
            this.dateTime = new Date(milliseconds);

            return BrsInvalid.Instance;
        },
    });

    private toISOString = new Callable("toISOString", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            return new BrsString(this.dateTime.toISOString());
        },
    });

    private fromISO8601String = new Callable("fromISO8601String", {
        signature: {
            args: [new StdlibArgument("dateString", ValueKind.String)],
            returns: ValueKind.Invalid,
        },
        impl: (_: Interpreter, dateString: BrsString) => {
            let milliseconds = Date.parse(dateString.value);
            if ((milliseconds = NaN)) {
                this.dateTime = new Date();
            } else {
                this.dateTime = new Date(milliseconds);
            }
            return BrsInvalid.Instance;
        },
    });

    private asDateString = new Callable("asDateString", {
        signature: {
            args: [new StdlibArgument("dateString", ValueKind.String)],
            returns: ValueKind.String,
        },
        impl: (_: Interpreter, format: BrsString) => {
            if (format.value in this.formatOptions) {
                let formatter = this.formatOptions[format.value];

                let dateString = dateFns.format(this.dateTime, formatter);
                return new BrsString(dateString);
            } else {
                return new BrsString("");
            }
        },
    });
}
