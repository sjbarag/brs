const { getComponentDefinitionMap } = require("../../lib/componentprocessor");
const { Interpreter, defaultExecutionOptions } = require("../../lib/interpreter");
const path = require("path");
const LexerParser = require("../../lib/LexerParser");

jest.mock("fast-glob");
jest.mock("fs");
const fg = require("fast-glob");
const fs = require("fs");

const realFs = jest.requireActual("fs");

describe.skip("integration tests", () => {
    beforeEach(() => {
        fg.sync.mockImplementation(() => {
            return [
                "baseComponent.xml",
                "extendedComponent.xml",
                "scripts/baseComp.brs",
                "scripts/extendedComp.brs",
                "scripts/utility.brs",
            ];
        });
        fs.readFile.mockImplementation((filename, _, cb) => {
            resourcePath = path.join(__dirname, "resources", filename);
            realFs.readFile(resourcePath, "utf8", (err, contents) => {
                cb(/* no error */ null, contents);
            });
        });
    });

    it("runs", () => {
        expect(true).toEqual(true);
    });

    afterEach(() => {
        fg.sync.mockRestore();
        fs.readFile.mockRestore();
    });
});
