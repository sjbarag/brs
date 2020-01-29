const { execute } = require("../../lib");

const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

describe("end to end brightscript functions", () => {
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

    test("_brs_-namespace.brs", async () => {
        await execute([resourceFile("stdlib", "_brs_-namespace.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter(arg => arg !== "\n")).toEqual([
            "_brs_.process.argv is non-empty: ",
            "true",
        ]);
    });
});
