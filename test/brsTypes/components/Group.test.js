const brs = require("../../../lib");
const { Group } = brs.types;

describe("Group", () => {
    describe("stringification", () => {
        it("inits a new Group component", () => {
            let group = new Group();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:Group> =
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
}`
            );
        });
    });
});
