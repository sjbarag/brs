const { BrsTypes } = require("brs");
const { Timespan, Int32, BrsBoolean } = BrsTypes;
const { Interpreter } = require("../../../lib/interpreter");

describe("Timespan", () => {
    let ts;

    beforeEach(() => {
        ts = new Timespan();
    });

    describe("stringification", () => {
        it("inits a new brs roTimespan", () => {
            expect(ts.toString()).toEqual("<Component: roTimespan>");
        });
    });

    describe("methods", () => {
        let interpreter;

        beforeEach(() => {
            interpreter = new Interpreter();
        });
    });
});