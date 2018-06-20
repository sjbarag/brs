const path = require("path");

const { execute } = require("../../lib/");
const BrsError = require("../../lib/Error");

const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

describe("end to end functions", () => {
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

    test("declarations.brs", async () => {
        await execute(
            resourceFile(path.join("function", "declarations.brs"), outputStreams)
        );
        expect(outputStreams.stdout.write).not.toHaveBeenCalled();
        expect(BrsError.found()).toBe(false);
    });
});