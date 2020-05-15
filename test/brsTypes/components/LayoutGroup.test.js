const brs = require("brs");
const { LayoutGroup } = brs.types;

describe("LayoutGroup", () => {
    describe("stringification", () => {
        it("inits a new LayoutGroup component", () => {
            let group = new LayoutGroup();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:LayoutGroup> =
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
    layoutdirection: vert
    horizalignment: left
    vertalignment: top
    itemspacings: invalid
    additemspacingafterchild: true
}`
            );
        });
    });
});
