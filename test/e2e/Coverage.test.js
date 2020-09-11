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

        // zero out the filenames in the locations so that it passes on any machine
        ["statements", "functions"].forEach((key) => {
            Object.keys(coverage[key]).forEach((stmtKey) => {
                coverage[key][stmtKey].location.file = "";
            });
        });
        Object.keys(coverage.branches).forEach((stmtKey) => {
            coverage.branches[stmtKey].locations = coverage.branches[stmtKey].locations.map(
                (loc) => {
                    loc.file = "";
                    return loc;
                }
            );
        });

        expect(coverage).toMatchSnapshot();
    });
});
