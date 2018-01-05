import * as fs from "fs";
import * as readline from "readline";

import { Token } from "./Token";
import * as Lexer from "./lexer";
import * as Parser from "./parser";
import { AstPrinter } from "./visitor/AstPrinter";
import { Executioner } from "./visitor/Executioner";
import * as BrsError from "./Error";


export function execute(filename: string) {
    fs.readFile(filename, "utf-8", (err, contents) => {
        run(contents);
        if (BrsError.found()) {
            process.exit(1);
        }
    });
}

export function repl() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.setPrompt("brs> ");

    rl.on("line", (line) => {
        run(line);

        BrsError.reset();
        rl.prompt();
    });

    rl.prompt();
}

function run(contents: string) {
    const tokens: ReadonlyArray<Token> = Lexer.scan(contents);
    const expr = Parser.parse(tokens);

    if (BrsError.found()) {
        return;
    }

    const executioner = new Executioner();

    executioner.exec(expr!);
}
