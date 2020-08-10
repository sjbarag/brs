const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

describe("Nest children inline from an extended component", () => {
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

    test("components/scripts/NestedInlineChildrenMain.brs", async () => {
        await execute(
            [resourceFile("components", "scripts", "NestedInlineChildrenMain.brs")],
            outputStreams
        );

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "rect1:",
            "Rectangle",
            "rect2:",
            "Rectangle",
            "rect3:",
            "Rectangle",
        ]);
    });
});
