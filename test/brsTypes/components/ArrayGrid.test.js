const brs = require("brs");
const { ArrayGrid } = brs.types;

describe("ArrayGrid", () => {
    describe("stringification", () => {
        it("inits a new ArrayGrid component", () => {
            let group = new ArrayGrid();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:ArrayGrid> =
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
    content: invalid
    itemsize: invalid
    itemspacing: invalid
    numrows: 0
    numcolumns: 0
    focusrow: 0
    focuscolumn: 0
    horizfocusanimationstyle: floatingFocus
    vertfocusanimationstyle: floatingFocus
    drawfocusfeedbackontop: false
    drawfocusfeedback: true
    fadefocusfeedbackwhenautoscrolling: false
    currfocusfeedbackopacity: NaN
    focusbitmapuri: 
    focusfootprintbitmapuri: 
    focusbitmapblendcolor: 0xFFFFFFFF
    focusfootprintblendcolor: 0xFFFFFFFF
    wrapdividerbitmapuri: 
    wrapdividerwidth: 0
    wrapdividerheight: 36
    fixedlayout: false
    numrenderpasses: 1
    rowheights: invalid
    columnwidths: invalid
    rowspacings: invalid
    columnspacings: invalid
    sectiondividerbitmapuri: 
    sectiondividerfont: invalid
    sectiondividertextcolor: system default
    sectiondividerspacing: 0
    sectiondividerwidth: 0
    sectiondividerheight: 0
    sectiondividerminwidth: 0
    sectiondividerleftoffset: 0
    itemclippingrect: invalid
    itemselected: 0
    itemfocused: 0
    itemunfocused: 0
    jumptoitem: 0
    animatetoitem: 0
    currfocusrow: 0
    currfocuscolumn: 0
    currfocussection: 0
}`
            );
        });
    });
});
