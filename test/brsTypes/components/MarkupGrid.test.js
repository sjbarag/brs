const brs = require("../../../lib");
const { MarkupGrid } = brs.types;

describe("MarkupGrid", () => {
    describe("stringification", () => {
        it("inits a new MarkupGrid component", () => {
            let group = new MarkupGrid();

            expect(group.toString()).toEqual(
                `<Component: roSGNode:MarkupGrid> =
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
    content: invalid
    itemsize: <Component: roArray>
    itemspacing: <Component: roArray>
    numrows: 12
    numcolumns: 0
    focusrow: 0
    focuscolumn: 0
    horizfocusanimationstyle: "floatingFocus"
    vertfocusanimationstyle: "floatingFocus"
    drawfocusfeedbackontop: false
    drawfocusfeedback: true
    fadefocusfeedbackwhenautoscrolling: false
    currfocusfeedbackopacity: NaN
    focusbitmapuri: ""
    focusfootprintbitmapuri: ""
    focusbitmapblendcolor: "0xFFFFFFFF"
    focusfootprintblendcolor: "0xFFFFFFFF"
    wrapdividerbitmapuri: ""
    wrapdividerwidth: 0
    wrapdividerheight: 0
    fixedlayout: false
    numrenderpasses: 1
    rowheights: <Component: roArray>
    columnwidths: <Component: roArray>
    rowspacings: <Component: roArray>
    columnspacings: <Component: roArray>
    sectiondividerbitmapuri: ""
    sectiondividerfont: invalid
    sectiondividertextcolor: "0xDDDDDDFF"
    sectiondividerspacing: 10
    sectiondividerwidth: 0
    sectiondividerheight: 40
    sectiondividerminwidth: 117
    sectiondividerleftoffset: 0
    itemclippingrect: <Component: roArray>
    itemselected: 0
    itemfocused: 0
    itemunfocused: 0
    jumptoitem: 0
    animatetoitem: 0
    currfocusrow: 0
    currfocuscolumn: 0
    currfocussection: 0
    itemcomponentname: ""
    imagewellbitmapuri: ""
}`
            );
        });
    });
});
