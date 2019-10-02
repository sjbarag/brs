const { execute } = require("../../lib/");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");
const lolex = require("lolex");

describe("end to end brightscript functions", () => {
    let outputStreams;
    let clock;

    beforeAll(() => {
        clock = lolex.install({ now: 1547072370937 });
        outputStreams = createMockStreams();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        clock.uninstall();
        jest.restoreAllMocks();
    });

    test("components/roArray.brs", async () => {
        await execute([resourceFile("components", "roArray.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter(arg => arg !== "\n")).toEqual([
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

        expect(allArgs(outputStreams.stdout.write).filter(arg => arg !== "\n")).toEqual([
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
            "can empty itself: ",
            "true",
        ]);
    });

    test("components/roDateTime.brs", async () => {
        await execute([resourceFile("components", "roDateTime.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter(arg => arg !== "\n")).toEqual([
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

        expect(allArgs(outputStreams.stdout.write).filter(arg => arg !== "\n")).toEqual([
            "can return seconds from date until now: ",
            "373447701",
            "can return 2077252342 for date that can't be parsed: ",
            "2077252342",
        ]);
    });

    test("components/roSGNode.brs", async () => {
        await execute([resourceFile("components", "roSGNode.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter(arg => arg !== "\n")).toEqual([
            "node size: ",
            "7",
            "node keys size: ",
            "7",
            "node items size: ",
            "7",
            "can delete elements: ",
            "true",
            "can look up elements: ",
            "true",
            "can look up elements (brackets): ",
            "true",
            "can check for existence: ",
            "true",
            "can empty itself: ",
            "true",
            //ifNodeField tests
            "node size: ",
            "3",
            "node size: ",
            "2",
            "field3 in node is: ",
            "false",
            "field3 in node now is: ",
            "true",
            "field1 in node now is: ",
            "hello",
            "field3 in node now is: ",
            "false",
            "callback 1 called",
            "callback 2 called",
            "field 3 updated",
            //ifNodeChildren tests
            "parent child count: ",
            "0",
            "get same parent from child: ",
            "true",
            "parent child count: ",
            "1",
            "parent child count: ",
            "2",
            "parent child count: ",
            "3",
            "parent child count: ",
            "2",
            "children size: ",
            "2",
            "first child id after replacing: ",
            "new node",
            "parent child count: ",
            "2",
            "parent child count: ",
            "2",
            "parent child count: ",
            "0",
            "parent child count: ",
            "3",
            "parent child count: ",
            "0",
            "parent child count: ",
            "2",
            "parent child count: ",
            "3",
            "parent child count: ",
            "4",
            "parent child count: ",
            "4",
            "parent child count: ",
            "6",
            "parent child count: ",
            "4",
            "inserted child id: ",
            "new node",
            "parent child count: ",
            "4",
            "new parent id: ",
            "new node",
            //ifSGNodeFocus tests
            "is parent in focus chain: ",
            "false",
            "is parent in focus chain: ",
            "true",
            "does grand child1 have focus: ",
            "true",
            "does grand child1 still have focus: ",
            "false",
            "does child2 have focus: ",
            "true",
            //ifNodeDict tests
            "find node that does not exist: ",
            "invalid",
            "node finds itself: ",
            "current",
            "node finds one of its children: ",
            "Child",
            "node finds its grandchild: ",
            "Grandchild",
            "node finds its sibling: ",
            "sibling-c7",
            "node finds a cousin node: ",
            "Cousin-2",
            "node finds its grandparent: ",
            "root-node",
            "is same node returns true:",
            "true",
            "is same node returns false:",
            "false",
            "Node subtype is returned:",
            "Node",
        ]);
    });

    test("components/roRegex.brs", async () => {
        await execute([resourceFile("components", "roRegex.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter(arg => arg !== "\n")).toEqual([
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
        ]);
    });

    test("components/roString.brs", async () => {
        await execute([resourceFile("components", "roString.brs")], outputStreams);

        expect(allArgs(outputStreams.stderr.write)).toEqual([]);
        expect(allArgs(outputStreams.stdout.write).filter(arg => arg !== "\n")).toEqual([
            "true", // comparison
            "5", // length
            "b", // split("/")[1]
            "%F0%9F%90%B6", // dog emoji, uri-encoded
            "🐶", // uri-encoded dog emoji, decoded
        ]);
    });
});
