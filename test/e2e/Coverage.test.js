const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

describe("checking coverage output", () => {
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

    test("running test", async () => {
        await execute([resourceFile("components", "scripts", "Coverage.brs")], {
            generateCoverage: true,
            ...outputStreams,
        });

        // expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([]);
        // expect(true).toEqual(true);
    });
});
