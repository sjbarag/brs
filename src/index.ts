import * as fs from "fs";
import * as readline from "readline";

import { Token } from "./Token";
import * as Lexer from "./lexer";
import * as Parser from "./parser";
import { AstPrinter } from "./visitor/AstPrinter";
import { Executioner } from "./visitor/Executioner";
import { stringify } from "./Stringify";
import * as BrsError from "./Error";

const executioner = new Executioner();

export function execute(filename: string) {
    fs.readFile(filename, "utf-8", (err, contents) => {
        run(contents);
        if (BrsError.found()) {
            process.exit(1);
        }
        // TODO: Wire up runtime errors so we can use a second exit code
    });
}

export function repl() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.setPrompt("brs> ");

    rl.on("line", (line) => {
        let results = run(line);
        if (results) {
            results.map(result => console.log(stringify(result)));
        }

        BrsError.reset();
        rl.prompt();
    });

    rl.prompt();
}

function run(contents: string) {
    const tokens: ReadonlyArray<Token> = Lexer.scan(contents);
    const statements = Parser.parse(tokens);

    if (BrsError.found()) {
        return;
    }

    if (!statements) { return; }

    return executioner.exec(statements);
}
