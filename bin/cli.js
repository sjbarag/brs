#!/usr/bin/env node
const program = require("commander");
const fs = require("fs");
const path = require("path");

const brs = require("../lib/");

// read current version from package.json
// I'll _definitely_ forget to do this one day
const packageJson = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, "..", "package.json")
    )
);

/** Set of phases valid for the `--stop-after` argument. */
const stopPhases = [ "lexer", "preprocessor", "parser" ];

program
    .description("Off-Roku BrightScript interpreter")
    .arguments("brs [brsFiles...]")
    .option(
        "-r, --root <directory>",
        "The root directory from which `pkg:` paths will be resolved.",
        process.cwd()
    )
    .option(
        "--stop-after <lex|preprocess|parse>",
        "Stops processing after the provided phase, printing the results of the final phase to the console."
    )
    .action((brsFiles, program) => {
        if (program.stopAfter && stopPhases.indexOf(program.stopAfter) === -1) {
            console.error(`ERROR: Unexpected '--stop-after' phase ${program.stopAfter}. Expected one of ${stopPhases.join(", ")}.`);
            process.exitCode = 1;
            return;
        }

        if (brsFiles.length > 0) {
            brs.execute(brsFiles, { root: program.root, stopAfter: program.stopAfter }).catch(err => {
                if (err.messages && err.messages.length) {
                    err.messages.forEach(message => console.error(message));
                } else {
                    console.error(err.message);
                }
                process.exitCode = 1;
                return;
            });
        } else {
            brs.repl();
        }
    })
    .version(packageJson.version, "-v, --version")
    .parse(process.argv);
