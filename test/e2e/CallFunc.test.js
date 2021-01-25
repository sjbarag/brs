const { execute } = require("../../lib");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

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
        await execute(
            [resourceFile("components", "call-func", "scripts", "main.brs")],
            outputStreams
        );

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "component: inside oneArg, args.test: ",
            "123",
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
            "1",
            "arg2: ",
            "2",
            "arg3: ",
            "3",
            "arg4: ",
            "4",
            "arg5: ",
            "5",
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
});
