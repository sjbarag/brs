const { execute } = require("../../lib");
let { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

resourceFile = resourceFile.bind(null, "components", "call-func", "scripts");

describe("callFunc", () => {
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

    test("components/call-func/scripts/main.brs", async () => {
        await execute([resourceFile("main.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "component: inside oneArg, args.test: ",
            " 123",
            "component: componentField:",
            "componentField value",
            "component: mainField:",
            "invalid",
            "main: component returnValFuncOneArg return value success:",
            "true",
            "component: inside voidFunctionNoArgs",
            "main: component voidFuncNoArgs return value:",
            "invalid",
            "main: component privateFunc return value:",
            "invalid",
            "component: inside fiveArgs",
            "arg1: ",
            " 1",
            "arg2: ",
            " 2",
            "arg3: ",
            " 3",
            "arg4: ",
            " 4",
            "arg5: ",
            " 5",
            "Inside parent function",
            "component: inside privateFunction",
            "private return value",
            "component: overriding parent func",
            "callFunc can trigger observeField",
            "main: mocked component voidFuncNoArgs return value:",
            "this is a mock",
        ]);

        expect(allArgs(outputStreams.stderr.write).filter((arg) => arg !== "\n")).toEqual([
            "Warning calling function in CallFuncTestbed: no function interface specified for privateFunc",
        ]);
    });

    test("components/call-func/scripts/throw/wrong-arg-type.brs", async () => {
        await execute([resourceFile("throw", "wrong-arg-type.brs")], outputStreams);

        expect(
            allArgs(outputStreams.stderr.write)
                .filter((arg) => arg !== "\n")
                .map((arg) => arg.trim())
        ).toEqual([
            expect.stringContaining(
                `test/e2e/resources/components/call-func/scripts/throw/wrong-arg-type.brs(5,4-46): Provided arguments don't match stronglyTyped's signature.
    function stronglyTyped(arg1 as String) as String:
        * Argument 'arg1' must be of type String, but received Object.`
            ),
        ]);
    });

    test("components/call-func/scripts/throw/no-args.brs", async () => {
        await execute([resourceFile("throw", "no-args.brs")], outputStreams);

        expect(allArgs(outputStreams.stderr.write).filter((arg) => arg !== "\n")).toEqual([
            expect.stringContaining(
                `test/e2e/resources/components/call-func/scripts/throw/no-args.brs(5,4-34): Provided arguments don't match stronglyTyped's signature.
    function stronglyTyped(arg1 as String) as String:
        * stronglyTyped requires at least 1 arguments, but received 0.`
            ),
        ]);
    });
});
