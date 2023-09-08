const brs = require("../../../lib");
const { Label } = brs.types;

describe("Label", () => {
    describe("stringification", () => {
        it("inits a new Label component", () => {
            let group = new Label();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:Label> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: ""
    visible: true
    opacity: 1
    translation: <Component: roArray>
    rotation: 0
    scale: <Component: roArray>
    scalerotatecenter: <Component: roArray>
    childrenderorder: "renderLast"
    inheritparenttransform: true
    inheritparentopacity: true
    clippingrect: <Component: roArray>
    renderpass: 0
    muteaudioguide: false
    enablerendertracking: false
    rendertracking: "disabled"
    text: ""
    color: "0xddddddff"
    font: invalid
    horizalign: "left"
    vertalign: "top"
    width: 0
    height: 0
    numlines: 0
    maxlines: 0
    wrap: false
    linespacing: 0
    displaypartiallines: false
    ellipsizeonboundary: false
    truncateondelimiter: ""
    wordbreakchars: ""
    ellipsistext: ""
    istextellipsized: false
}`
            );
        });
    });
});
