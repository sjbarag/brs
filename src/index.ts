import * as fs from "fs";
import * as readline from "readline";

import { Token } from "./Token";
import * as Lexer from "./lexer";
import * as Parser from "./parser";
import { AstPrinter } from "./interpreter/AstPrinter";
import { Interpreter } from "./interpreter";
import { stringify } from "./Stringify";
import * as BrsError from "./Error";

const interpreter = new Interpreter();

export function execute(filename: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf-8", (err, contents) => {
            if (err) {
                reject({
                    "message" : `brs: can't open file '${filename}': [Errno ${err.errno}]`
                });
            } else {
                run(contents);
                if (BrsError.found()) {
                    reject({ 
                        "message" : "Error occurred" 
                    });
                } else {
                    resolve();
                }
                // TODO: Wire up runtime errors so we can use a second exit code
            }
        });
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
            results.map(result => console.log(stringify(result.value)));
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

    return interpreter.exec(statements);
}
