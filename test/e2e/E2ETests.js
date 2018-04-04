const path = require("path");

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
    return jestMock.mock.calls.reduce((allArgs, thisCall) => allArgs.concat(thisCall), []);
}
