const path = require("path");
const { execute, getCoverageResults } = require("../../lib");
const { createMockStreams, resourceFile } = require("./E2ETests");

jest.mock("fast-glob");
jest.mock("fs");
const fg = require("fast-glob");
const fs = require("fs");

const realFs = jest.requireActual("fs");

describe("coverage", () => {
    let outputStreams;

    beforeAll(() => {
        outputStreams = createMockStreams();
        outputStreams.root = __dirname + "/resources";
    });

    beforeEach(() => {
        fg.sync.mockImplementation(() => {
            return ["main.brs"];
        });

        fs.readFile.mockImplementation((filename, _, cb) => {
            resourcePath = path.join(__dirname, "resources", "components", "coverage", filename);
            realFs.readFile(resourcePath, "utf8", (err, contents) => {
                cb(/* no error */ null, contents || "");
            });
        });
    });

    afterEach(() => {
        fg.sync.mockRestore();
        fs.readFile.mockRestore();
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test("matches snapshot", async () => {
        await execute(["main.brs"], {
            generateCoverage: true,
            ...outputStreams,
        });
        let coverage = getCoverageResults()["main.brs"];

        expect(coverage).toMatchSnapshot();
    });
});
