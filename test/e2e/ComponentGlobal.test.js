const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

describe("m.global usage in scenegraph components", () => {
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

    test("components/componentGlobalUsage.brs", async () => {
        await execute([resourceFile("components", "componentGlobalUsage.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "inside component init, m.global.brsIntField: ",
            " 123",
            "MGlobalWidget.text: ",
            "",
            "MUniversalWidget.text: ",
            "Globally setting this value",
            "_brs_.global.value: ",
            "Globally setting this value",
        ]);
    });
});
