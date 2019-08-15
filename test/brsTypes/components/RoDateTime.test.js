const brs = require("brs");
const { RoDateTime, Int32, BrsString, BrsInvalid } = brs.types;
const { Interpreter } = require("../../../lib/interpreter");
const lolex = require("lolex");
const dateFns = require("date-fns");

describe("RoDateTime", () => {
    let dateTime;
    let clock;
    let fixedDate = "2019-08-09T20:52:58.000Z";
    let fixedDateInMilliseconds = 1565383928000;

    beforeEach(() => {
        clock = lolex.install({ now: fixedDateInMilliseconds });
        dateTime = new RoDateTime();
    });

    afterAll(() => {
        clock.uninstall();
    });

    describe("stringification", () => {
        it("inits a new brs roDateTime", () => {
            expect(dateTime.toString()).toEqual("<Component: roDateTime>");
        });
    });

    describe("methods", () => {
        let interpreter;

        beforeEach(() => {
            interpreter = new Interpreter();
            dateTime = new RoDateTime();
        });

        describe("mark", () => {
            it("Reset date to the current date time", () => {
                let mark = dateTime.getMethod("mark");
                let advanceTime = 50000;
                clock.tick(advanceTime);
                let result = mark.call(interpreter);

                expect(mark).toBeTruthy();
                expect(dateTime.dateTime).toEqual(Date());
            });
        });

        describe("getTimeZoneOffset", () => {
            it("Returns the time-zone offset in minutes for the current locale.", () => {
                let getTimeZoneOffset = dateTime.getMethod("getTimeZoneOffset");
                let currentDate = new Date();
                let timeZoneOffset = currentDate.getTimezoneOffset();
                let result = getTimeZoneOffset.call(interpreter);

                expect(getTimeZoneOffset).toBeTruthy();
                expect(result).toEqual(new Int32(timeZoneOffset));
            });
        });

        describe("asSeconds", () => {
            it("Returns the date/time as the number of seconds from the Unix epoch", () => {
                let asSeconds = dateTime.getMethod("asSeconds");

                let fixedDateInSeconds = fixedDateInMilliseconds / 1000;
                let expectedResult = new Int32(fixedDateInSeconds);
                let result = asSeconds.call(interpreter);

                expect(asSeconds).toBeTruthy();
                expect(dateTime.dateTime).toEqual(Date());
                expect(result).toEqual(new Int32(fixedDateInSeconds));
            });
        });

        describe("fromSeconds", () => {
            it("Set the date/time value using the number of seconds from the Unix epoch", () => {
                let fromSeconds = dateTime.getMethod("fromSeconds");
                let advanceTime = 50000;
                clock.tick(advanceTime);
                let fixedDateInSeconds = (fixedDateInMilliseconds + advanceTime) / 1000;
                let result = fromSeconds.call(interpreter, new Int32(fixedDateInSeconds));

                expect(fromSeconds).toBeTruthy();
                expect(dateTime.dateTime).toEqual(Date());
            });
        });

        describe("toISOString", () => {
            it("Return an ISO 8601 representation of the date/time value", () => {
                let toISOString = dateTime.getMethod("toISOString");
                let result = toISOString.call(interpreter);
                let expected = new BrsString(Date().toISOString());

                expect(toISOString).toBeTruthy();
                expect(result).toEqual(expected);
            });
        });

        describe("asDateString", () => {
            it("Returns the date/time as a formatted string", () => {
                let asDateString = dateTime.getMethod("asDateString");
                let formatOptions = {
                    "long-date": "dddd MMMM D, YYYY",
                    "short-weekday": "dd MMMM D, YYYY",
                    "no-weekday": "MMMM D, YYYY",
                    "short-month": "dddd MMM D, YYYY",
                    "short-month-short-weekday": "dd MMM D, YYYY",
                    "short-month-no-weekday": "MMM D, YYYY",
                    "short-date": "M/D/YY",
                    "short-date-dashes": "M-D-YY",
                };

                let formats = Object.keys(formatOptions);
                formats.forEach(format => {
                    let result = asDateString.call(interpreter, new BrsString(format));
                    let expected = dateFns.format(Date(), formatOptions[format]);

                    expect(asDateString).toBeTruthy();
                    expect(result).toEqual(new BrsString(expected));
                });
            });
        });

        describe("getLastDayOfMonth", () => {
            it("Returns the date/time value's last day of the month - 28...31", () => {
                /* Known leap years */
                /* [2000, 2004, 2008, 2012, 2016, 2020, 2024, 2028, 2032] */
                let knownDates = {
                    949399200000: 29 /* 02/01/2000 */,
                    1009901115000: 31 /* 01/01/2002 */,
                    1012579515000: 28 /* 02/01/2002 */,
                    1014998715000: 31 /* 03/01/2002 */,
                    1017677115000: 30 /* 04/01/2002 */,
                    1020269115000: 31 /* 05/01/2002 */,
                    1022947515000: 30 /* 06/01/2002 */,
                    1025539515000: 31 /* 07/01/2002 */,
                    1028217915000: 31 /* 08/01/2002 */,
                    1030896315000: 30 /* 09/01/2002 */,
                    1033488315000: 31 /* 10/01/2002 */,
                    1036166715000: 30 /* 11/01/2002 */,
                    1038758715000: 31 /* 12/01/2002 */,
                    1549037115000: 28 /* 02/01/2019 */,
                    1580573115000: 29 /* 02/01/2020 */,
                };
                let dates = Object.keys(knownDates);
                dates.forEach(date => {
                    let newDate = Number(date);
                    clock = lolex.install({ now: newDate });
                    dateTime = new RoDateTime();

                    let getLastDayOfMonth = dateTime.getMethod("getLastDayOfMonth");
                    let result = getLastDayOfMonth.call(interpreter);
                    let knownLastDay = new Int32(knownDates[date]);

                    expect(getLastDayOfMonth).toBeTruthy();
                    expect(result).toEqual(knownLastDay);
                });
            });
        });
    });
});
