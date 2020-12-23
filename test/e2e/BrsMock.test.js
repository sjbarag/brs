const { execute } = require("../../lib");
const { createMockStreams, resourceFile: baseResourceFile, allArgs } = require("./E2ETests");
const lolex = require("lolex");
const path = require("path");

function resourceFile(...fileParts) {
    return baseResourceFile(...["components", "mocks"].concat(fileParts));
}

describe("e2e/resources/components/mocks", () => {
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

    test("components/main.brs", async () => {
        await execute([resourceFile("components", "main.brs")], outputStreams);

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

    test("functions/main.brs", async () => {
        await execute([resourceFile("functions", "main.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "{fake:'json'}",
            "your wish is my command",
            "Named foo",
            "--inline foo--",
            "--inline foo--",
            "doesn't exist in source yet here i am",
            "spyOnMe",
            "1",
            "2",
            "first string",
            "123",
            "1",
            "mocked implementation!",
            "2",
            "2",
            "second string",
            "456",
            "2",
            "mocked implementation!",
            "0",
            "0",
        ]);
    });

    test("components/partial/main.brs", async () => {
        await execute([resourceFile("components", "partial", "main.brs")], outputStreams);

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

    describe("reset", () => {
        describe("resetMocks", () => {
            test("function.brs", async () => {
                await execute(
                    [
                        resourceFile("reset", "resetMocks", "function.brs"),
                        resourceFile("reset", "helpers.brs"),
                    ],
                    outputStreams
                );

                expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
                    "fake fooBar",
                    "foo bar",
                ]);
            });

            test("component.brs", async () => {
                jest.spyOn(global.console, "error").mockImplementation();
                jest.spyOn(global.console, "warn").mockImplementation();
                await execute(
                    [
                        resourceFile("reset", "resetMocks", "component.brs"),
                        resourceFile("reset", "helpers.brs"),
                    ],
                    outputStreams
                );

                expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
                    "fake testbed 1",
                    "bar",
                ]);

                global.console.error.mockRestore();
                global.console.warn.mockRestore();
            });
        });

        test("resetMockFunction.brs", async () => {
            await execute(
                [
                    resourceFile("reset", "resetMockFunction.brs"),
                    resourceFile("reset", "helpers.brs"),
                ],
                outputStreams
            );

            expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
                "foo bar",
                "fake barBaz",
            ]);
        });

        test("resetMockFunctions.brs", async () => {
            await execute(
                [
                    resourceFile("reset", "resetMockFunctions.brs"),
                    resourceFile("reset", "helpers.brs"),
                ],
                outputStreams
            );

            expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
                "foo bar",
                "fake testbed 1",
            ]);
        });

        test("resetMockComponent.brs", async () => {
            await execute(
                [
                    resourceFile("reset", "resetMockComponent.brs"),
                    resourceFile("reset", "helpers.brs"),
                ],
                outputStreams
            );

            expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
                "fake testbed 1",
                "bar",
            ]);
        });

        test("resetMockComponents.brs", async () => {
            await execute(
                [
                    resourceFile("reset", "resetMockComponents.brs"),
                    resourceFile("reset", "helpers.brs"),
                ],
                outputStreams
            );

            expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
                "fake fooBar",
                "bar",
            ]);
        });

        describe("partial", () => {
            beforeEach(() => {
                jest.spyOn(global.console, "error").mockImplementation();
                jest.spyOn(global.console, "warn").mockImplementation();
            });

            afterEach(() => {
                global.console.error.mockRestore();
                global.console.warn.mockRestore();
            });

            test("resetMockFunction.brs", async () => {
                await execute(
                    [
                        resourceFile("reset", "partial", "resetMockFunction.brs"),
                        resourceFile("reset", "helpers.brs"),
                    ],
                    outputStreams
                );

                expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
                    "unscoped fake funcTestbed",
                    "scoped fake funcTestbed",
                    "unscoped fake funcTestbed",
                    "real funcTestbed",
                    "scoped fake funcTestbed",
                    "invalid",
                ]);
            });

            test("resetMockComponent.brs", async () => {
                await execute(
                    [
                        resourceFile("reset", "partial", "resetMockComponent.brs"),
                        resourceFile("reset", "helpers.brs"),
                    ],
                    outputStreams
                );

                expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
                    "unscoped fake funcTestbed",
                    "scoped fake funcTestbed",
                    "unscoped fake funcTestbed",
                    "unscoped fake funcTestbed",
                    "unscoped fake funcTestbed",
                    "unscoped fake funcTestbed",
                ]);
            });
        });
    });
});
