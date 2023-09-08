const brs = require("../../../lib");
const { Timer } = brs.types;

describe("Timer", () => {
    describe("stringification", () => {
        it("initializes a new Timer component", () => {
            let timer = new Timer();

            expect(timer.toString()).toEqual(
                `<Component: roSGNode:Timer> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: ""
    control: ""
    repeat: false
    duration: 0
    fire: <UNINITIALIZED>
}`
            );
        });
    });
});
