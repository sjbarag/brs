const { BrsTypes } = require("brs");
const { Timespan, Int32, BrsBoolean, BrsInvalid } = BrsTypes;
const { Interpreter } = require("../../../lib/interpreter");
const { lolex } = require("lolex");

describe("Timespan", () => {
    let ts;
    let clock;
    let baseTime;
    
    beforeEach(() => {
        console.log(lolex);
        clock = lolex.install();
        baseTime = lolex.createClock()
        ts = new Timespan();
    });

    afterAll(() => {
        lolex.uninstall();
    });
    
    describe("stringification", () => {
        it("inits a new brs roTimespan", () => {
            expect(ts.toString()).toEqual("<Component: roTimespan>");
        });
    });
    
    describe("markTime", () => {
        it("inits a new timespan with the current time", () => {
            expect(ts.markTime).toEqual();
        });
    });
    
    // describe("methods", () => {
    //     let interpreter;
    //     let currentTime;
        
    //     beforeEach(() => {
    //         interpreter = new Interpreter();
    //     });

    //     describe("mark", () => {
    //         it("resets mark time to current time", () => {
    //             let mark = ts.getMethod("mark");
    //             expect(mark).toBeTruthy();
    //             currentTime += 10000;
                
    //             let result = mark.call(interpreter);
    //             expect(ts.markTime).toEqual(currentTime);
    //             expect(result).toBe(BrsInvalid.Instance);
    //         });
    //     });

    //     describe("totalmilliseconds", () => {
    //         it("returns milliseconds from marked time until now", () => {
    //             currentTime += 10000;

    //             let totalmilliseconds = ts.getMethod("totalmilliseconds");
    //             expect(totalmilliseconds).toBeTruthy();

    //             // console.log(currentTime - ts.markTime);
    //             let result = totalmilliseconds.call(interpreter)
    //             expect(result).toEqual(new Int32(10000));
    //         });
    //     });
    // });
});
