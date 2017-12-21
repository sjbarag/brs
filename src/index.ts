import * as fs from "fs";
import * as readline from "readline";

export function execute(filename: string) {
    fs.readFile(filename, "utf-8", (err, data) => {
        
    });
}

export function repl() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.setPrompt("ORBS> ");

    rl.on("line", (line) => {
        run(line);
        rl.prompt();
    }).on("close", () => {
        // ensure user's prompt starts on new line
        rl.write("");
    });

    rl.prompt();
}

function run(line: string) {
    console.log(`Thanks for entering '${line}'`);
}