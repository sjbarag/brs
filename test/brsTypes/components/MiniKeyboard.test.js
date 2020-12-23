const brs = require("brs");
const { MiniKeyboard } = brs.types;

describe("MiniKeyboard", () => {
    describe("stringification", () => {
        it("inits a new MiniKeyboard component", () => {
            let miniKeyboard = new MiniKeyboard();

            expect(miniKeyboard.toString()).toEqual(
                `<Component: roSGNode:MiniKeyboard> =
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
    keycolor: 0x000000FF
    focusedkeycolor: 0x000000FF
    keyboardbitmapuri: 
    focusbitmapuri: 
    texteditbox: <Component: roSGNode:TextEditBox>
    showtexteditbox: true
    lowercase: true
}`
            );
        });
    });
});
