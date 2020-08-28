const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");
const lolex = require("lolex");
const path = require("path");

describe("end to end brightscript functions", () => {
    let outputStreams;
    let clock;

    beforeAll(() => {
        clock = lolex.install({ now: 1547072370937 });
        outputStreams = createMockStreams();
        outputStreams.root = path.join(__dirname, "resources");
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        clock.uninstall();
        jest.restoreAllMocks();
    });

    test("mock-components-main.brs", async () => {
        await execute([resourceFile("mock-components-main.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "marking mock timespan",
            "mocked timespan should return 8: ",
            "8",
            "create object regex:",
            "roRegex",
            "mock object regex:",
            "Node",
            "in name change callback",
            "mock poster name:",
            "poster",
            "mocked node id:",
            "node-id",
            "mocked node name:",
            "node-name",
            "mocked node child index:",
            "333",
            "second mock node id is not mutated by first mock:",
            "id",
            "second mock node name is not mutated by first mock:",
            "name",
            "created mock for child node:",
            "true",
        ]);
    });

    test("mock-functions-main.brs", async () => {
        let consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        await execute([resourceFile("mock-functions-main.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "{fake:'json'}",
            "your wish is my command",
            "Named foo",
            "--inline foo--",
            "--inline foo--",
            "doesn't exist in source yet here i am",
        ]);

        // split the warning because the line number output is user-specific.
        let warning = allArgs(consoleErrorSpy)
            .filter((arg) => arg !== "\n")[0]
            .split("WARNING: ")[1]
            .trim();
        expect(warning).toEqual(
            "using mocked function 'thisfuncdoesnotexist', but no function with that name is found in-scope in source."
        );

        consoleErrorSpy.mockRestore();
    });

    test("partial-mock-functions-main.brs", async () => {
        await execute([resourceFile("partial-mock-functions-main.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "{fake:'json'}",
            "GET status: 400",
            "POST status: 500",
            "true",
            "mocked correctly!",
            "{real: 'json'}",
            "GET status: 200",
            "POST status: 200",
            "false",
            "mocked correctly!",
        ]);
    });

    test("reset-mocks.brs", async () => {
        await execute([resourceFile("reset-mocks.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "fake",
            "foo bar",
            "fake",
            "bar",
            "foo bar",
            "fake",
            "fake",
            "bar",
        ]);
    });
});
