import { BrsValue, ValueKind, BrsString, BrsBoolean, BrsInvalid, Comparable } from "../BrsType";
import { BrsComponent } from "./BrsComponent";
import { BrsType } from "..";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { Int32 } from "../Int32";

export class RoDateTime extends BrsComponent implements BrsValue, Comparable {
    readonly kind = ValueKind.Object;
    private dateTime: Date;

    constructor() {
        super("roDateTime", ["ifDateTime"]);
        this.dateTime = new Date();

        this.registerMethods([
            /**
            this.mark,
            this.toLocalTime,
            this.getTimeZoneOffset,
            */
            this.asSeconds,
            /** 
            this.fromSeconds,
            this.toISOString,
            this.fromISO8601String,
            this.asDateString,
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

    unbox() {
        return this.dateTime;
    }

    toString(parent?: BrsType): string {
        return "<Component: roDateTime>";
    }

    private asSeconds = new Callable("asSeconds", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (interpreter: Interpreter) => {
            return new Int32(this.dateTime.getSeconds());
        },
    });
}
