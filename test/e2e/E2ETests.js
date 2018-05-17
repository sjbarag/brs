const path = require("path");
const stream = require("stream");

/** Returns the path to a file in `resources/`. */
exports.resourceFile = function(filename) {
    return path.join(__dirname, "resources", filename);
}

/**
 * Extracts all arguments from all calls to a Jest mock function.
 * @param jestMock the mock to extract arguments from
 * @returns an array containing every argument from every call to a Jest mock.
 */
exports.allArgs = function(jestMock) {
    return jestMock.mock.calls
            // remove trailing newlines from final argument
            .map(args => args.map((a, i) => i + 1=== args.length ? a.replace(/\n$/, "") : a))
            // flatten arguments to `stdout.write` into a single array
            .reduce((allArgs, thisCall) => allArgs.concat(thisCall), []);
}

/** Creates a set of mocked streams, suitable for use in place of `process.stdout` and `process.stderr`. */
exports.createMockStreams = function() {
    const stdout = new stream.PassThrough();
    const stderr = new stream.PassThrough();
    jest.spyOn(stdout, "write");
    jest.spyOn(stderr, "write");

    return { stdout, stderr };
}
