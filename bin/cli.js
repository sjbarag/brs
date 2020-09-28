#!/usr/bin/env node
const program = require("commander");
const fs = require("fs");
const path = require("path");

const brs = require("../lib/");

// read current version from package.json
// I'll _definitely_ forget to do this one day
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json")));

program
    .description("Off-Roku BrightScript interpreter")
    .arguments("brs [brsFiles...]")
    .option(
        "-r, --root <directory>",
        "The root directory from which `pkg:` paths will be resolved.",
        process.cwd()
    )
    .option(
        "-c, --component-dirs <directories>",
        "Comma-separated list of additional directories beyond `components` to search for XML components",
        (value) => value.split(","),
        []
    )
    .action(async (brsFiles, program) => {
        if (brsFiles.length > 0) {
            try {
                await brs.execute(brsFiles, {
                    root: program.root,
                    componentDirs: program.componentDirs,
                });
            } catch (err) {
                if (err.messages && err.messages.length) {
                    err.messages.forEach((message) => console.error(message));
                } else {
                    console.error(err.message);
                }
                process.exitCode = 1;
            }
        } else {
            console.log(`Off-Roku BrightScript interpreter [Version ${packageJson.version}]`);
            console.log("");
            brs.repl();
        }
    })
    .version(packageJson.version, "-v, --version")
    .parse(process.argv);
