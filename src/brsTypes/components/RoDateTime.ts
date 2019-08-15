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

    private dateComponentsOptions: { [id: string]: string } = {
        weekDay: "dddd",
        fullYear: "YYYY",
        month: "M",
        dayOfMoth: "D",
        hours: "H",
        minutes: "m",
        seconds: "s",
        milliseconds: "SSS",
        dayOfWeek: "d",
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
            this.getDayOfWeek,
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

    private dateFormatter(date: Date, format: string): string {
        return dateFns.format(date, format);
    }

    // note that month is 0-based, like in the Date object.
    private getNumberOfDays(year: number, month: number): number {
        let isLeap = year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
        return [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
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
                let dateString = this.dateFormatter(
                    this.dateTime,
                    this.formatOptions[format.value]
                );

                return new BrsString(dateString);
            } else {
                return new BrsString("");
            }
        },
    });

    private asDateStringNoParam = new Callable("asDateStringNoParam", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_: Interpreter, format: BrsString) => {
            let dateString = this.dateFormatter(this.dateTime, this.formatOptions["long-date"]);

            return new BrsString(dateString);
        },
    });

    private getWeekday = new Callable("getWeekday", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_: Interpreter, format: BrsString) => {
            let dateString = this.dateFormatter(
                this.dateTime,
                this.dateComponentsOptions["weekDay"]
            );

            return new BrsString(dateString);
        },
    });

    private getYear = new Callable("getYear", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_: Interpreter, format: BrsString) => {
            let dateString = this.dateFormatter(
                this.dateTime,
                this.dateComponentsOptions["fullYear"]
            );

            return new Int32(Number(dateString));
        },
    });

    private getMonth = new Callable("getMonth", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_: Interpreter, format: BrsString) => {
            let dateString = this.dateFormatter(this.dateTime, this.dateComponentsOptions["month"]);

            return new Int32(Number(dateString));
        },
    });

    private getDayOfMonth = new Callable("getDayOfMonth", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_: Interpreter, format: BrsString) => {
            let dateString = this.dateFormatter(
                this.dateTime,
                this.dateComponentsOptions["dayOfMoth"]
            );

            return new Int32(Number(dateString));
        },
    });

    private getHours = new Callable("getHours", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_: Interpreter, format: BrsString) => {
            let dateString = this.dateFormatter(this.dateTime, this.dateComponentsOptions["hours"]);

            return new Int32(Number(dateString));
        },
    });

    private getMinutes = new Callable("getMinutes", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_: Interpreter, format: BrsString) => {
            let dateString = this.dateFormatter(
                this.dateTime,
                this.dateComponentsOptions["minutes"]
            );

            return new Int32(Number(dateString));
        },
    });

    private getSeconds = new Callable("getSeconds", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_: Interpreter, format: BrsString) => {
            let dateString = this.dateFormatter(
                this.dateTime,
                this.dateComponentsOptions["seconds"]
            );

            return new Int32(Number(dateString));
        },
    });

    private getMilliseconds = new Callable("getMilliseconds", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_: Interpreter, format: BrsString) => {
            let dateString = this.dateFormatter(
                this.dateTime,
                this.dateComponentsOptions["milliseconds"]
            );

            return new Int32(Number(dateString));
        },
    });

    private getLastDayOfMonth = new Callable("getLastDayOfMonth", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_: Interpreter, format: BrsString) => {
            return new Int32(
                this.getNumberOfDays(this.dateTime.getFullYear(), this.dateTime.getMonth())
            );
        },
    });

    private getDayOfWeek = new Callable("getDayOfWeek", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_: Interpreter, format: BrsString) => {
            let dateString = this.dateFormatter(
                this.dateTime,
                this.dateComponentsOptions["dayOfWeek"]
            );

            return new Int32(Number(dateString));
        },
    });
}
