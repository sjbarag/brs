const brs = require("../../../lib");
const { Rectangle } = brs.types;

describe("Rectangle", () => {
    describe("stringification", () => {
        it("inits a new Rectangle component", () => {
            let group = new Rectangle();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:Rectangle> =
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
    width: 0
    height: 0
    color: "0xFFFFFFFF"
    blendingenabled: true
}`
            );
        });
    });
});
