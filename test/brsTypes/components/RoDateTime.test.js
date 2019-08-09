const brs = require("brs");
const { RoDateTime, Int32, BrsString, BrsInvalid } = brs.types;
const { Interpreter } = require("../../../lib/interpreter");
const lolex = require("lolex");

describe("RoDateTime", () => {
    let dateTime;
    let clock;
    let fixedDate = "2019-08-09T20:52:58.655Z";
    let fixedDateInMilliseconds = 1565383928655;

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
    });
});
