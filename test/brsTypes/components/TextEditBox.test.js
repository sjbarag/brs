const brs = require("brs");
const { TextEditBox } = brs.types;

describe("TextEditBox", () => {
    describe("stringification", () => {
        it("inits a new TextEditBox component", () => {
            let textEditBox = new TextEditBox();

            expect(textEditBox.toString()).toEqual(
                `<Component: roSGNode:TextEditBox> =
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
    text: 
    hinttext: 
    maxtextlength: 15
    cursorposition: 0
    clearondownkey: true
    active: false
    textcolor: OxFFFFFFFF
    hinttextcolor: OxFFFFFFFF
    width: -1
    backgrounduri: 
}`
            );
        });
    });
});
