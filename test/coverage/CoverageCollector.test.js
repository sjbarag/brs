const { defaultExecutionOptions } = require("../../lib/interpreter");
const path = require("path");
const LexerParser = require("../../lib/LexerParser");
const { CoverageCollector } = require("../../lib/coverage/CoverageCollector");

jest.mock("../../lib/coverage/FileCoverage");
jest.mock("fast-glob");
jest.mock("fs");
const fg = require("fast-glob");
const fs = require("fs");
const { Test } = require("tslint");
const { FileCoverage } = require("../../lib/coverage/FileCoverage");

const realFs = jest.requireActual("fs");

describe("CoverageCollector.ts", () => {
    beforeEach(() => {
        fg.sync.mockImplementation(() => {
            return ["script1.brs", "scripts/script2.brs", "scripts/script3.brs"];
        });

        fs.readFile.mockImplementation((filename, _, cb) => {
            resourcePath = path.join(__dirname, "resources", filename);
            realFs.readFile(resourcePath, "utf8", (err, contents) => {
                cb(/* no error */ null, contents);
            });
        });

        FileCoverage.mockClear();
    });

    afterEach(() => {
        fg.sync.mockRestore();
        fs.readFile.mockRestore();
    });

    test("constructor creates one file coverage class per file", async () => {
        let coverageCollector = new CoverageCollector(
            defaultExecutionOptions.root,
            LexerParser.getLexerParserFn(new Map(), defaultExecutionOptions)
        );
        await coverageCollector.crawlBrsFiles();

        expect(FileCoverage).toHaveBeenCalledTimes(3);
    });

    test("logHit forwards a hit to the correct file", async () => {
        let coverageCollector = new CoverageCollector(
            defaultExecutionOptions.root,
            LexerParser.getLexerParserFn(new Map(), defaultExecutionOptions)
        );
        await coverageCollector.crawlBrsFiles();

        coverageCollector.logHit({ location: { file: "script1.brs" } });

        FileCoverage.mock.instances.forEach((fileMock, index) => {
            // only the first one should have been called
            let calledTimes = index === 0 ? 1 : 0;
            expect(fileMock.logHit).toHaveBeenCalledTimes(calledTimes);
        });
    });

    test("getCoverage maps file names to coverage information", async () => {
        let coverageCollector = new CoverageCollector(
            defaultExecutionOptions.root,
            LexerParser.getLexerParserFn(new Map(), defaultExecutionOptions)
        );
        await coverageCollector.crawlBrsFiles();

        let coverageReport = coverageCollector.getCoverage();
        expect(Object.keys(coverageReport)).toEqual([
            "script1.brs",
            "scripts/script2.brs",
            "scripts/script3.brs",
        ]);
    });
});
