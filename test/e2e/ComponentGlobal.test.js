const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

describe("m.global usage in scenegraph components", () => {
    let outputStreams;

    beforeAll(() => {
        outputStreams = createMockStreams();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test("components/componentGlobalUsage.brs", async () => {
        outputStreams.root = __dirname + "/resources";
        await execute([resourceFile("components", "componentGlobalUsage.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter(arg => arg !== "\n")).toEqual([
            "",
            "Globally setting this value",
        ]);
    });
});
