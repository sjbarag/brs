const brs = require("brs");
const { Rectangle } = brs.types;

describe("Rectangle", () => {
    describe("stringification", () => {
        it("inits a new Rectangle component", () => {
            let group = new Rectangle();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:Rectangle> =
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
    width: 0
    height: 0
    color: 0xFFFFFFFF
    blendingenabled: true
}`
            );
        });
    });
});
