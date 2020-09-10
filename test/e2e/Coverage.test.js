const path = require("path");
const { execute, getCoverageResults } = require("../../lib");
const { createMockStreams, resourceFile } = require("./E2ETests");

describe("coverage", () => {
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

    test("matches snapshot", async () => {
        await execute([resourceFile("components", "coverage", "main.brs")], {
            generateCoverage: true,
            ...outputStreams,
        });
        let filePath = path.join(__dirname, "resources", "components", "coverage", "main.brs");
        let coverage = getCoverageResults()[filePath];

        expect(coverage).toMatchSnapshot();
    });
});
