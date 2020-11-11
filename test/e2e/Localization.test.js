const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

describe("Localization", () => {
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

    test("components/localization/main.brs", async () => {
        await execute([resourceFile("components", "localization", "source", "main.brs")], {
            ...outputStreams,
            root: "test/e2e/resources/components/localization",
        });

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "Bonjour",
            "hello",
            "Au revoir",
            "world",
            "123",
        ]);
    });
});
