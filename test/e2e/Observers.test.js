const { execute } = require("../../lib/");
const { createMockStreams, resourceFile, allArgs } = require("./E2ETests");
const path = require("path");

describe("end to end brightscript functions", () => {
    let outputStreams;

    beforeAll(() => {
        outputStreams = createMockStreams();
        outputStreams.root = path.join(__dirname, "resources", "observers");
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test("observers/unscoped-main.brs", async () => {
        await execute([resourceFile("observers", "unscoped-main.brs")], outputStreams);
        expect(allArgs(outputStreams.stdout.write).join("")).toBe(
            `[Observer::init]
[Observer::init]
[Observer2::init]
[Observer#a :: onTargetChanged] observing
[Observer#b :: onTargetChanged] observing
[Observer2#c :: onTargetChanged] observing
[Observer#a :: onTriggerChanged] trigger = 1
[Observer#b :: onTriggerChanged] trigger = 1
[Observer2#c :: onTriggerChanged] trigger = 1
[Observer#a :: onTriggerChanged] trigger = 2
[Observer#b :: onTriggerChanged] trigger = 2
[Observer2#c :: onTriggerChanged] trigger = 2
[Observer#a :: onTriggerChanged] trigger = unobserve-a
[Observer#a :: onTriggerChanged] unobserveField result = true
`
        );
    });
});
