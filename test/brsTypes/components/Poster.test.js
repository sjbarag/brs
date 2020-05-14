const brs = require("brs");
const { Poster } = brs.types;

describe("Poster", () => {
    describe("stringification", () => {
        it("inits a new Poster component", () => {
            let group = new Poster();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:Poster> =
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
    uri: 
    width: 0
    height: 0
    loadsync: false
    loadwidth: 0
    loadheight: 0
    loaddisplaymode: noScale
    loadstatus: noScale
    bitmapwidth: 0
    bitmapheight: 0
    bitmapmargins: invalid
    blendcolor: 0xFFFFFFFF
    loadingbitmapuri: 
    loadingbitmapopacity: 1
    failedbitmapuri: 
    failedbitmapopacity: 1
    audioguidetext: 
}`
            );
        });
    });
});
