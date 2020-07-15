const child_process = require("child_process");
const path = require("path");
const { promisify } = require("util");

const exec = promisify(child_process.exec);

describe("cli", () => {
    it("accepts a root directory", async () => {
        let rootDir = path.join(__dirname, "resources");

        let command = [
            "node",
            path.join(process.cwd(), "bin", "cli.js"),
            "--root",
            rootDir,
            path.join(rootDir, "requires-manifest.brs"),
        ].join(" ");

        let { stdout } = await exec(command);
        expect(stdout.trim()).toEqual("hi from foo()");
    });

    it("defaults --root to process.cwd()", async () => {
        let command = [
            "node",
            path.join(process.cwd(), "bin", "cli.js"),
            "requires-manifest.brs",
        ].join(" ");

        let { stdout } = await exec(command, {
            cwd: path.join(__dirname, "resources"),
        });
        expect(stdout.trim()).toEqual("hi from foo()");
    });

    it("throws syntax errors once", async () => {
        let filename = "errors/syntax-error.brs";
        let stderr = await runWithErrors(filename);
        expect(stderr.split(filename).length).toEqual(3);
    });

    it("throws eval errors once", async () => {
        let filename = "errors/uninitialized-object.brs";
        let stderr = await runWithErrors(filename);
        expect(stderr.split(filename).length).toEqual(2);
    });
});

async function runWithErrors(filename) {
    let command = ["node", path.join(process.cwd(), "bin", "cli.js"), filename].join(" ");

    try {
        await exec(command, {
            cwd: path.join(__dirname, "resources"),
        });
        return Promise.reject(`Script ran without error: ${filename}`);
    } catch (err) {
        return err.stderr || "";
    }
}
