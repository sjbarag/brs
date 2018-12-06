const { AssociativeArray, BrsObjects } = require("../../lib/brsTypes");
const BrsError = require("../../lib/Error");

describe("BrsObjects", () => {
    beforeEach(() => BrsError.reset());

    describe("new object instances", () => {
        it("maps a new instance of associative array", () => {
            let obj = BrsObjects.get("roassociativearray")
            expect(obj()).toEqual(new AssociativeArray([]));
        });
    });
});
