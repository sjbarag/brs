const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

describe("e2e/components/key-events", () => {
    let outputStreams;

    beforeAll(() => {
        outputStreams = createMockStreams();
        outputStreams.root = __dirname + "/resources";
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test("resources/components/key-events/main.brs", async () => {
        await execute([resourceFile("components", "key-events", "main.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "onKeyEvent KeyEvents_Child",
            "foo",
            "true",
            "onKeyEvent KeyEvents_Parent",
            "foo",
            "true",
            "onKeyEvent KeyEvents_Grandparent",
            "foo",
            "true",
            "onKeyEvent KeyEvents_Child",
            "OK",
            "true",
            "onKeyEvent KeyEvents_Parent",
            "OK",
            "true",
            "onKeyEvent KeyEvents_Grandparent",
            "OK",
            "true",
            "onKeyEvent KeyEvents_Child",
            "OK",
            "true",
            "onKeyEvent KeyEvents_Parent",
            "OK",
            "true",
            "onKeyEvent KeyEvents_Child",
            "OK",
            "true",
        ]);
    });
});
