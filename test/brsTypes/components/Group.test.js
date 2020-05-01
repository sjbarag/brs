const brs = require("brs");
const {
    RoAssociativeArray,
    RoSGNode,
    RoArray,
    BrsBoolean,
    BrsString,
    Int32,
    BrsInvalid,
    ValueKind,
    Uninitialized,
    Group,
} = brs.types;

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
    visible: false
    opacity: 0
    translation: invalid
    rotation: 0
    scale: invalid
    scalerotatecenter: invalid
    childrenderorder: 
    inheritparenttransform: false
    inheritparentopacity: false
    clippingrect: invalid
    renderpass: 0
    muteaudioguide: false
    enablerendertracking: false
    rendertracking: 
}`
            );
        });
    });
});
