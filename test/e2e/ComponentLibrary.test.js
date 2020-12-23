const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");
const path = require("path");

describe("ComponentLibrary", () => {
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

    test("component-library/source/main.brs", async () => {
        await execute([resourceFile("component-library", "source", "main.brs")], {
            ...outputStreams,
            root: path.join(__dirname, "resources", "component-library"),
        });

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "[Foo:Bar::init]",
            "[Foo:util::someUtil]",
            "[RegistersCL::init]",
            "[util::someUtil]",
            "[RegistersCL::init] createObject-ing Foo:Bar…",
            "[Foo:Bar::init]",
            "[Foo:util::someUtil]",
            "[RegistersCL::init] …done.",
        ]);
    });
});
