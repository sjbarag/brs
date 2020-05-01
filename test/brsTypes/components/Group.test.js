const brs = require("brs");
const {
    RoAssociativeArray,
    RoSGNode,
    RoArray,
    BrsBoolean,
    BrsString,
    Int32,
    BrsInvalid,
    ValueKind,
    Uninitialized,
    Group,
} = brs.types;

describe.only("Group", () => {
    describe("stringification", () => {
        it("lists all primitive values", () => {
            let group = new Group([
                { name: new BrsString("string"), value: new BrsString("a string") },
            ]);

            console.log(group.toString());
        });
    });
});
