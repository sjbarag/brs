const { execute } = require("../../lib/");

const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");

describe("end to end standard libary", () => {
    let outputStreams;

    beforeAll(() => {
        outputStreams = createMockStreams();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test("stdlib/files.brs", async () => {
        await execute([resourceFile("stdlib", "files.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "false",
            "true",
            "true",
            "true",
            "true",
            "true",
            "false",
            "true",
            "false",
            "<Component: roArray> =\n[\n    test_backup.txt\n]",
            "true",
        ]);
    });

    test("stdlib/strings.brs", async () => {
        await execute([resourceFile("stdlib", "strings.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "MIXED CASE",
            "mixed case",
            "12359",
            "ぇ",
            "Mixed",
            "Case",
            "10",
            "ed",
            "7",
            "10",
            " 3.4",
            "-3",
            "12.34",
            "Mary and Bob",
            "252",
            "abababab",
            "!!!!!!!!",
        ]);
    });

    test("stdlib/math.brs", async () => {
        await execute([resourceFile("stdlib", "math.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "22.19795",
            "2.85647",
            "3.342155",
            "0.4636476",
            "0.7073883",
            "0.9999997",
            "0.999204",
            "3.5",
            "17",
            "17",
            "204",
            "-2",
            "7",
            "1",
            "-1",
        ]);
    });

    test("stdlib/runtime.brs", async () => {
        await execute([resourceFile("stdlib", "runtime.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual(["true"]);
    });

    test("stdlib/json.brs", async () => {
        await execute([resourceFile("stdlib", "json.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "",
            `{"boolean":false,"float":3.14,"integer":2147483647,"longinteger":2147483650,"null":null,"string":"ok"}`,
            [
                "<Component: roAssociativeArray> =",
                "{",
                "    boolean: false",
                "    float: 3.14",
                "    integer: 2147483647",
                "    longinteger: 2147483650",
                "    null: invalid",
                "    string: ok",
                "}",
            ].join("\n"),
        ]);
    });

    test("stdlib/run.brs", async () => {
        await execute([resourceFile("stdlib", "run.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "in run.brs",
            "    in runme.brs",
            "returned to run.brs",
            "runme.brs returned: ",
            "2",
        ]);
    });

    test("stdlib/global-utilities.brs", async () => {
        await execute([resourceFile("stdlib", "global-utilities.brs")], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "<Interface: ifFloat>",
            "<Interface: ifAssociativeArray>",
            "<Interface: ifSGNodeDict>",
        ]);
    });
});
