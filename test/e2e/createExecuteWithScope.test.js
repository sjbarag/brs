const brs = require("../../lib");
const { createExecuteWithScope } = brs;
const { RoArray, BrsString } = brs.types;
let { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

resourceFile = resourceFile.bind(null, "execute-with-scope");

describe("createExecuteWithScope", () => {
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

    test("returns a function that executes a file", async () => {
        let execute = await createExecuteWithScope([resourceFile("in-scope.brs")], outputStreams);

        expect(execute).toBeTruthy();

        let returnValue = execute([resourceFile("main.brs")], [new BrsString("argz4main")]);
        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "main:arg:argz4main",
            "main:commonUtil",
            "main:onlyInScopeForMain",
        ]);
        expect(returnValue).toBeInstanceOf(BrsString);
        expect(returnValue.value).toEqual("main return value");
    });

    test("code defined in earlier execution calls is not accessible to subsequent executions", async () => {
        let execute = await createExecuteWithScope([resourceFile("in-scope.brs")], outputStreams);

        // main defines a function
        execute([resourceFile("main.brs")], [new BrsString("argz4main")]);

        // main2 tries to call that function, and fails
        expect(() => execute([resourceFile("main2.brs")], [])).toThrow();

        // the output from both files should be there
        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "main:arg:argz4main",
            "main:commonUtil",
            "main:onlyInScopeForMain",
            "main2:commonUtil",
        ]);
    });

    test("interpreter errors in earlier executions don't affect subsequent executions", async () => {
        let execute = await createExecuteWithScope([resourceFile("in-scope.brs")], outputStreams);

        // main2 throws an error
        expect(() => execute([resourceFile("main2.brs")], [])).toThrow();

        // main should be error-free still
        expect(() =>
            execute([resourceFile("main.brs")], [new BrsString("argz4main")])
        ).not.toThrow();

        // the output from both files should be there
        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "main2:commonUtil",
            "main:arg:argz4main",
            "main:commonUtil",
            "main:onlyInScopeForMain",
        ]);
    });

    test("mocks defined in earlier execution calls do not exist in subsequent executions", async () => {
        let execute = await createExecuteWithScope([resourceFile("in-scope.brs")], outputStreams);

        // mock.brs mocks the function
        execute([resourceFile("mock.brs")], []);

        // main calls the function
        execute([resourceFile("main.brs")], [new BrsString("argz4main")]);

        // the output from both files should be there
        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "mock:mocked",
            "main:arg:argz4main",
            "main:commonUtil",
            "main:onlyInScopeForMain",
        ]);
    });
});
