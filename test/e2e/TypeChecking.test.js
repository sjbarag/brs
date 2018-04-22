const path = require("path");

const { execute } = require("../../lib/");
const BrsError = require("../../lib/Error");

const { resourceFile, allArgs } = require("./E2ETests");

describe("function argument type checking", () => {
    let stderr;
    let originalNodeEnv;

    beforeAll(() => {
        originalNodeEnv = process.env.NODE_ENV;
        // switch NODE_ENV to not-test, to ensure errors get logged
        process.env.NODE_ENV = "jest";
        // but make console.error empty so we don't clutter test output
        stderr = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        stderr.mockClear();
        BrsError.reset();
    });

    afterAll(() => {
        stderr.mockRestore()
        process.env.NODE_ENV = originalNodeEnv;
    });

    it("errors when too few args are passed", () => {
        return execute(resourceFile(path.join("type-checking", "too-few-args.brs"))).catch(() => {
            const output = allArgs(stderr);
            expect(output[0]).toMatch(/\[Line .\] 'UCase' requires at least 1 arguments, but received 0\./);
        });
    });

    it("errors when too many args are passed", () => {
        return execute(resourceFile(path.join("type-checking", "too-many-args.brs"))).catch(() => {
            const output = allArgs(stderr);
            expect(output[0]).toMatch(/\[Line .\] 'RebootSystem' accepts at most 0 arguments, but received 1\./);
        });
    });

    it("errors when mismatched types are provided", () => {
        return execute(resourceFile(path.join("type-checking", "arg-type-mismatch.brs"))).catch(() => {
            const output = allArgs(stderr);
            expect(output[0]).toMatch(
                /\[Line .\] Type mismatch in 'LCase': argument 's' must be of type String, but received Boolean./
            );
        });
    });
});
