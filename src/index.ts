import * as fs from "fs";
import * as readline from "readline";

import { Token } from "./Token";
import * as Lexer from "./Lexer";
import * as OrbsError from "./Error";


export function execute(filename: string) {
    fs.readFile(filename, "utf-8", (err, contents) => {
        run(contents);
        if (OrbsError.found()) {
            process.exit(1);
        }
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

        OrbsError.reset();
        rl.prompt();
    });

    rl.prompt();
}

function run(contents: string) {
    const tokens: ReadonlyArray<Token> = Lexer.scan(contents);

    tokens.forEach(console.dir);
}
