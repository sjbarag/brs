const brs = require("../../../lib");
const { LayoutGroup } = brs.types;

describe("LayoutGroup", () => {
    describe("stringification", () => {
        it("inits a new LayoutGroup component", () => {
            let group = new LayoutGroup();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:LayoutGroup> =
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
    layoutdirection: "vert"
    horizalignment: "left"
    vertalignment: "top"
    itemspacings: <Component: roArray>
    additemspacingafterchild: true
}`
            );
        });
    });
});
