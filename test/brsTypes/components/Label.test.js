const brs = require("brs");
const { Label } = brs.types;

describe("Label", () => {
    describe("stringification", () => {
        it("inits a new Label component", () => {
            let group = new Label();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:Label> =
{
    change: <UNINITIALIZED>
    focusable: false
    focusedchild: invalid
    id: 
    visible: true
    opacity: 1
    translation: invalid
    rotation: 0
    scale: invalid
    scalerotatecenter: invalid
    childrenderorder: renderLast
    inheritparenttransform: true
    inheritparentopacity: true
    clippingrect: invalid
    renderpass: 0
    muteaudioguide: false
    enablerendertracking: false
    rendertracking: disabled
    text: 
    color: 0xddddddff
    font: invalid
    horizalign: left
    vertalign: top
    width: 0
    height: 0
    numlines: 0
    maxlines: 0
    wrap: false
    linespacing: 0
    displaypartiallines: false
    ellipsizeonboundary: false
    truncateondelimiter: 
    wordbreakchars: 
    ellipsistext: 
    istextellipsized: false
}`
            );
        });
    });
});
