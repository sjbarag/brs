const { execute } = require("../../lib/");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");
const lolex = require("lolex");

describe("end to end brightscript functions", () => {
    let outputStreams;
    let clock;
    const OLD_ENV = process.env;

    beforeAll(() => {
        clock = lolex.install({ now: 1547072370937 });
        outputStreams = createMockStreams();
        outputStreams.root = __dirname + "/resources";
    });

    beforeEach(() => {
        process.env = { ...OLD_ENV };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        clock.uninstall();
        jest.restoreAllMocks();
        process.env = OLD_ENV;
    });

    test("components/roArray.brs", async () => {
        await execute([resourceFile("components", "roArray.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "array length: ",
            "4",
            "last element: ",
            "sit",
            "first element: ",
            "lorem",
            "can delete elements: ",
            "true",
            "can empty itself: ",
            "true",
        ]);
    });

    test("components/roAssociativeArray.brs", async () => {
        await execute([resourceFile("components", "roAssociativeArray.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "AA size: ",
            "3",
            "AA keys size: ",
            "3",
            "AA items size: ",
            "3",
            "can delete elements: ",
            "true",
            "can look up elements: ",
            "true",
            "can look up elements (brackets): ",
            "true",
            "can check for existence: ",
            "true",
            "items() example key: ",
            "bar",
            "items() example value: ",
            "5",
            "key is not found if sensitive mode is enabled",
            "false",
            "key exits with correct casing",
            "value1",
            "lookup uses mode case too",
            "value1",
            "can empty itself: ",
            "true",
        ]);
    });

    test("components/roDateTime.brs", async () => {
        await execute([resourceFile("components", "roDateTime.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "Full Date: ",
            "Friday November 12, 2010",
            "No Week Day: ",
            "November 12, 2010",
            "Short Date: ",
            "11/12/10",
            "Weekday: ",
            "Friday",
            "Day of Week: ",
            "5",
            "Day of Month: ",
            "12",
            "Month: ",
            "11",
            "Year: ",
            "2010",
            "Hours: ",
            "13",
            "Minutes: ",
            "14",
            "Seconds: ",
            "15",
            "Last Day of Month: ",
            "30",
            "Milliseconds: ",
            "160",
            "ISO String UTC: ",
            "2010-11-12T13:14:15Z",
        ]);
    });

    test("components/roTimespan.brs", async () => {
        await execute([resourceFile("components", "roTimespan.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "can return seconds from date until now: ",
            "373447701",
            "can return 2077252342 for date that can't be parsed: ",
            "2077252342",
        ]);
    });

    test("components/roRegex.brs", async () => {
        await execute([resourceFile("components", "roRegex.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "HeLlO_123_WoRlD is match of hello_[0-9]*_world: ",
            "true",
            "goodbye_123_WoRlD isn't match of hello_[0-9]*_world: ",
            "true",
            "Replacing ',' in 2019,03,26 by '-' on first occurrence: ",
            "2019-03,26",
            "Replacing ',' in 2019,03,26 by '-' on all occurrences: ",
            "2019-03-26",
            "Split by ',': [ ",
            "2019",
            " ",
            "03",
            " ",
            "26",
            " ]",
            "First match: [ ",
            "123",
            " ]",
            "All matches: [ ",
            "[ ",
            "123",
            " ]",
            "[ ",
            "456",
            " ]",
            "[ ",
            "789",
            " ]",
            " ]",
            "Matches with groups: [ ",
            "[ ",
            "abx",
            ", ",
            "bx",
            " ]",
            "[ ",
            "aby",
            ", ",
            "by",
            " ]",
            " ]",
        ]);
    });

    test("components/roString.brs", async () => {
        await execute([resourceFile("components", "roString.brs")], outputStreams);

        expect(allArgs(outputStreams.stderr.write)).toEqual([]);
        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "hello",
            "bar",
            "bar",
            "foo",
            "true", // comparison
            "5", // length
            "b", // split("/")[1]
            "%F0%9F%90%B6", // dog emoji, uri-encoded
            "🐶", // uri-encoded dog emoji, decoded
        ]);
    });

    test("components/roXMLElement.brs", () => {
        return execute([resourceFile("components", "roXMLElement.brs")], outputStreams).then(() => {
            expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
                "xmlParser = ",
                "<Component: roXMLElement>",
                "type(xmlParser) = ",
                "roXMLElement",
                "parse bad xml string, result = ",
                "false",
                "parse good xml string, result = ",
                "true",
                "getName() = ",
                "tag1",
                "getAttributes() = ",
                `<Component: roAssociativeArray> =\n` +
                    `{\n` +
                    `    id: someId\n` +
                    `    attr1: 0\n` +
                    `}`,
                'getNamedElementsCi("child1") count = ',
                "2",
                "name of first child  = ",
                "Child1",
                "mame of second child = ",
                "CHILD1",
            ]);
        });
    });

    test("components/customComponent.brs", async () => {
        await execute([resourceFile("components", "customComponent.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "node.baseBoolField: ",
            "false",
            "node.baseIntField: ",
            "0",
            "node.normalBoolField: ",
            "true",
            "node.advancedStringField: ",
            "advancedField!",
            "node.advancedIntField: ",
            "12345",
            "node child count is: ",
            "6",
            "child id is: ",
            "normalLabel",
            "otherNode child count is: ",
            "3",
            "anotherNode child count is: ",
            "1",
            "baseRectangle width: ",
            "100",
            "baseRectangle height: ",
            "200",
        ]);
    });

    test("components/componentExtension.brs", async () => {
        await execute([resourceFile("components", "componentExtension.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "BaseChild init",
            "BaseComponent init",
            "ExtendedComponent start",
            "ExtendedChild init",
            "ExtendedComponent init",
            "ExtendedComponent start",
            "true", //m.top.isSubtype("ExtendedComponent")
            "true", //m.top.isSubtype("BaseComponent")
            "true", //m.top.isSubtype("Node")
            "false", // m.top.isSubtype("OtherComponent")
            "BaseComponent", //m.top.parentSubtype("ExtendedComponent")
            "Node", //m.top.parentSubtype("BaseComponent")
        ]);
    });

    test("components/roIntrinsics.brs", async () => {
        await execute([resourceFile("components", "roIntrinsics.brs")], outputStreams);

        expect(allArgs(outputStreams.stderr.write)).toEqual([]);
        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "Boolean object A ",
            "true",
            "Boolean object B ",
            "false",
            "Comparing true = false should be false ",
            "false",
            "Double value ",
            "123.456",
            "Double value * 2 ",
            "246.912",
            "Float object ",
            "789.012",
            "Float object * 10 ",
            "7890.12",
            "Integer object ",
            "23",
            "Integer object times itself ",
            "529",
            "Double to string ",
            "123.456",
            "Float to string ",
            "789.012",
            "Integer to string ",
            "23",
            "LongInteger object type",
            "roLongInteger",
            "LongInteger to string ",
            "2000111222333",
        ]);
    });

    test("components/roInvalid.brs", async () => {
        await execute([resourceFile("components", "roInvalid.brs")], outputStreams);

        expect(allArgs(outputStreams.stderr.write)).toEqual([]);
        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "roInvalid",
            "<Component: roInvalid>",
            "invalid",
            "true",
        ]);
    });

    test("components/Group.brs", async () => {
        await execute([resourceFile("components", "Group.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "group node type:",
            "Node",
            "group node subtype:",
            "Group",
            "group node visible:",
            "true",
            "group node opacity:",
            "1",
            "extended group node type:",
            "Node",
            "extended group node subtype:",
            "ExtendedGroup",
            "extended group node visible:",
            "true",
            "extended group node opacity:",
            "1",
            "group as child node rotation:",
            "0.2",
        ]);
    });

    test("components/LayoutGroup.brs", async () => {
        await execute([resourceFile("components", "LayoutGroup.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "layoutGroup node type:",
            "Node",
            "layoutGroup node subtype:",
            "LayoutGroup",
            "layoutGroup node layoutDirection:",
            "vert",
            "layoutGroup node horizAlignment:",
            "left",
            "layoutGroup as child layoutDirection:",
            "horiz",
            "layoutGroup as child horizAlignment:",
            "right",
        ]);
    });

    test("components/Rectangle.brs", async () => {
        await execute([resourceFile("components", "Rectangle.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "rectangle node type:",
            "Node",
            "rectangle node subtype:",
            "Rectangle",
            "rectangle node width:",
            "0",
            "rectangle node height:",
            "0",
            "rectangle as child width:",
            "500",
            "rectangle as child height:",
            "50",
        ]);
    });

    test("components/Label.brs", async () => {
        await execute([resourceFile("components", "Label.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "label node type:",
            "Node",
            "label node subtype:",
            "Label",
            "label node horizAlign:",
            "left",
            "label node numLines:",
            "0",
            "label as child numLines:",
            "10",
            "label as child wrap:",
            "true",
            "label as child lineSpacing:",
            "5.5",
        ]);
    });

    test("components/Timer.brs", async () => {
        await execute([resourceFile("components", "Timer.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "timer node type:",
            "Node",
            "timer node subtype:",
            "Timer",
            "timer node control:",
            "",
            "timer node repeat:",
            "false",
            "timer node duration:",
            "0",
            "timer node fire:",
            "<UNINITIALIZED>",
        ]);
    });

    test("components/Font.brs", async () => {
        await execute([resourceFile("components", "Font.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "font node type:",
            "Node",
            "font node subtype:",
            "Font",
            "font node uri:",
            "",
            "font node size:",
            "1",
            "font node fallbackGlyph:",
            "",
            "font as child size:",
            "56",
            "font as child uri:",
            "font/as/child/uri",
        ]);
    });

    test("components/Poster.brs", async () => {
        await execute([resourceFile("components", "Poster.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "poster node type:",
            "Node",
            "poster node subtype:",
            "Poster",
            "poster node width:",
            "0",
            "poster node height:",
            "0",
            "poster as child audioGuideText:",
            "fake text",
            "poster as child uri:",
            "/fake/uri",
            "poster as child bitmapWidth:",
            "10.4",
        ]);
    });

    test("components/ArrayGrid.brs", async () => {
        await execute([resourceFile("components", "ArrayGrid.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "arraygrid node type:",
            "Node",
            "arraygrid node subtype:",
            "ArrayGrid",
            "arraygrid node focusRow:",
            "0",
            "arraygrid node jumpToItem:",
            "0",
            "arraygrid as child wrapDividerWidth",
            "1.23",
            "arraygrid as child numRows",
            "5",
        ]);
    });

    test("components/MarkupGrid.brs", async () => {
        await execute([resourceFile("components", "MarkupGrid.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "markupgrid node type:",
            "Node",
            "markupgrid node subtype:",
            "MarkupGrid",
            "markupgrid node numRows:",
            "12",
            "markupgrid node sectionDividerMinWidth:",
            "117",
            "markupgridAsChild numColumns:",
            "10",
            "markupgridAsChild fixedLayout:",
            "true",
        ]);
    });

    test("components/field-change/main.brs", async () => {
        await execute([resourceFile("components", "field-change", "main.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            // inheritance/overrides
            "runner: node childHandled text field value before modifying:",
            "childHandled initial",
            "child: text field changed. new value:",
            "childHandled modified",
            "runner: node childHandled text field value after modifying:",
            "childHandled modified",
            "runner: node parentHandled text field value before modifying:",
            "parentHandled initial",
            "parent: parentHandled text field changed",
            "parentHandled modified",
            "runner: node parentHandled text field value after modifying:",
            "parentHandled modified",

            // onChange with an event
            "runner: modifying intField",
            "child: event",
            "<Component: roSGNodeEvent>",
            "child: event.getData()",
            "123",
            "child: event.getField()",
            "intField",
            "child: event.getRoSGNode().subtype()",
            "FieldChangeComponent",
            "child: event.getNode()",
            "id-field-change",

            // changing a field multiple times
            "child: current event:",
            "123",
            "child: previous event:",
            "123",
            "child: current event:",
            "456",
        ]);
    });

    test("components/ContentNode.brs", async () => {
        await execute([resourceFile("components", "scripts", "ContentNode.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "contentnode node type:",
            "Node",
            "contentnode node subtype:",
            "ContentNode",
            "contentnode.ContentType:",
            "",
            "contentnode.TargetRotation:",
            "0",
            "contentnodeAsChild.episodeNumber:",
            "10",
            "contentnodeAsChild.subtitleUrl:",
            "subtitle.example.com",
        ]);
    });

    test("components/scripts/ComponentFields.brs", async () => {
        await execute(
            [resourceFile("components", "scripts", "ComponentFields.brs")],
            outputStreams
        );

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "bar",
            "invalid",
            "invalid",
            "Node",
        ]);
    });

    test("components/roDeviceInfo.brs", async () => {
        process.env.TZ = "PST";
        process.env.LOCALE = "en_US";

        await execute([resourceFile("components", "roDeviceInfo.brs")], outputStreams);
        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "",
            "",
            "",
            "0",
            "",
            "0",
            "",
            "",
            "true",
            "",
            "36",
            "PST",
            "false",
            "en_US",
            "en_US",
            "en_US",
            "fr_CA",
            "fr_CA",
            "fr_CA",
            "",
            "0",
            "0",
            "0",
            "true",
            "on",
            "default",
            "",
            "true",
            "true",
            "true",
            "",
            "false",
            "true",
            "true",
            "",
            "",
            "0",
            "0",
            "",
            "",
            "",
            "0",
            "",
            "0",
            "0",
            "true",
            "mpeg4 avc",
            "0",
            "",
            "true",
            "",
            "0",
            "true",
            "0",
            "",
            "true",
        ]);
    });

    test("components/Scene.brs", async () => {
        await execute([resourceFile("components", "Scene.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "scene node type:",
            "Node",
            "scene node subtype:",
            "Scene",
            "scene node backs exit scene:",
            "true",
            "scene node background uri:",
            "/images/arrow.png",
            "scene node background color:",
            "0xEB1010FF",
            "extended scene node type:",
            "Node",
            "extended scene node subtype:",
            "ExtendedScene",
            "extended scene node backs exit scene:",
            "true",
            "extended scene node background uri:",
            "/images/arrow.png",
            "extended scene node background color:",
            "0xEB1010FF",
        ]);
    });

    test("components/MiniKeyboard.brs", async () => {
        await execute([resourceFile("components", "MiniKeyboard.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "miniKeyboard node type:",
            "Node",
            "miniKeyboard node subtype:",
            "MiniKeyboard",
            "miniKeyboard text:",
            "hello",
            "miniKeyboard keyColor:",
            "0x000000FF",
            "miniKeyboard focusedKeyColor:",
            "0x000000FF",
            "miniKeyboard keyBitmapUri:",
            "/images/somebitmap.bmp",
            "miniKeyboard focusBitmapUri:",
            "/images/somebitmap.bmp",
            "miniKeyboard showTextEditBox:",
            "true",
            "miniKeyboard lowerCase:",
            "true",
            "miniKeyboard textEditBox text:",
            "hello",
        ]);
    });

    test("components/TextEditBox.brs", async () => {
        await execute([resourceFile("components", "TextEditBox.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "textEditBox node type:",
            "Node",
            "textEditBox node subtype:",
            "TextEditBox",
            "textEditBox text:",
            "hello",
            "textEditBox hint text:",
            "",
            "textEditBox maxTextLength:",
            "15",
            "textEditBox cursorPosition:",
            "0",
            "textEditBox clearOnDownKey:",
            "true",
            "textEditBox active:",
            "false",
            "textEditBox textColor:",
            "OxFFFFFFFF",
            "textEditBox hintTextColor:",
            "OxFFFFFFFF",
            "textEditBox width:",
            "-1",
            "textEditBox backgroundUri:",
            "",
        ]);
    });
});
