const brs = require("brs");
const { Font } = brs.types;

describe("Font", () => {
    describe("stringification", () => {
        it("inits a new Font component", () => {
            let group = new Font();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:Font> =
{
    change: <UNINITIALIZED>
    focusable: false
    focusedchild: invalid
    id: 
    uri: 
    size: 1
    fallbackglyph: 
}`
            );
        });
    });
});
