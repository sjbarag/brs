const brs = require("brs");
const { Group } = brs.types;

describe("Group", () => {
    describe("stringification", () => {
        it("inits a new Group component", () => {
            let group = new Group();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:Group> =
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
}`
            );
        });
    });
});
