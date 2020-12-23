const brs = require("brs");
const { Scene } = brs.types;

describe("Scene", () => {
    describe("stringification", () => {
        it("inits a new Scene component", () => {
            let scene = new Scene();

            expect(scene.toString()).toEqual(
                `<Component: roSGNode:Scene> =
{
    change: <Component: roAssociativeArray>
    focusable: false
    focusedchild: invalid
    id: 
    visible: true
    opacity: 1
    translation: <Component: roArray>
    rotation: 0
    scale: <Component: roArray>
    scalerotatecenter: <Component: roArray>
    childrenderorder: renderLast
    inheritparenttransform: true
    inheritparentopacity: true
    clippingrect: <Component: roArray>
    renderpass: 0
    muteaudioguide: false
    enablerendertracking: false
    rendertracking: disabled
    backgrounduri: 
    backgroundcolor: 0x000000FF
    backexitsscene: true
    dialog: invalid
    currentdesignresolution: <Component: roAssociativeArray>
}`
            );
        });
    });
});
