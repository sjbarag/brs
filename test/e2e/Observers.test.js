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
            `[UnscopedObserver::init]
[UnscopedObserver::init]
[UnscopedObserver2::init]
[UnscopedObserver#a :: onTargetChanged] observing
[UnscopedObserver#b :: onTargetChanged] observing
[UnscopedObserver2#c :: onTargetChanged] observing
[UnscopedObserver#a :: onTriggerChanged] trigger = 1
[UnscopedObserver#b :: onTriggerChanged] trigger = 1
[UnscopedObserver2#c :: onTriggerChanged] trigger = 1
[UnscopedObserver#a :: onTriggerChanged] trigger = 2
[UnscopedObserver#b :: onTriggerChanged] trigger = 2
[UnscopedObserver2#c :: onTriggerChanged] trigger = 2
[UnscopedObserver#a :: onTriggerChanged] trigger = unobserve-a
[UnscopedObserver#a :: onTriggerChanged] unobserveField result = true
`
        );
    });
});
