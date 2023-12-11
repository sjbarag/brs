const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");
const lolex = require("lolex");

describe("m.top usage in scenegraph components", () => {
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

    test("components/componentTopUsage.brs", async () => {
        outputStreams.root = __dirname + "/resources";
        await execute([resourceFile("components", "componentTopUsage.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "this is a default value defined in xml",
            "true",
            "false",
            " 300",
            " 100",
            "this value set using m.top",
            "invalid",
        ]);
    });
});
