const path = require("path");

const { execute } = require("../../lib/");
const BrsError = require("../../lib/Error");

/** Returns the path to a file in `resources/`. */
function resourceFile(filename) {
    return path.join(__dirname, "resources", filename);
}

describe("end to end", () => {
    test("comments.brs", () => {
        return execute(resourceFile("comments.brs"));
    });
});