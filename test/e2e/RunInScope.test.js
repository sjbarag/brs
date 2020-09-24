const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

describe("_brs_.runInScope", () => {
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

    test("components/runInScope/main.brs", async () => {
        await execute([resourceFile("components", "runInScope", "main.brs")], outputStreams);

        let errOutput = allArgs(outputStreams.stderr.write).filter((arg) => arg !== "\n");
        expect(
            errOutput[0].includes("Attempting to retrieve property from non-iterable value")
        ).toBeTruthy();
        expect(
            errOutput[1].includes("Attempting to retrieve property from non-iterable value")
        ).toBeTruthy();
    });
});
