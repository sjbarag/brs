const path = require("path");

const { execute } = require("../../lib/");
const BrsError = require("../../lib/Error");

const { resourceFile, allArgs } = require("./E2ETests");

describe("end to end standard libary", () => {
    let stdout;

    beforeAll(() => {
        stdout = jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => stdout.mockReset());

    afterAll(() => stdout.mockRestore());

    test("stdlib/strings.brs", () => {
        return execute(resourceFile(path.join("stdlib", "strings.brs"))).then(() => {
            expect(allArgs(stdout)).toEqual([
                "MIXED CASE",
                "mixed case",
                "12359",
                "ぇ"
            ]);
        });
    });
});