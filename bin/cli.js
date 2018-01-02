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

let brsFile;

program
    .description("Off-Roku BrightScript interpreter")
    .arguments("brs <filename>")
    .action((filename) => brsFile = filename)
    .version(packageJson.version);

let args = program.parse(process.argv);

if (brsFile) {
    brs.execute(brsFile);
} else {
    brs.repl();
}