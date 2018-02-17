import * as fs from "fs";
import * as readline from "readline";

import { Token } from "./Token";
import * as Lexer from "./lexer";
import * as Parser from "./parser";
import { AstPrinter } from "./visitor/AstPrinter";
import { Interpreter } from "./visitor/Interpreter";
import { stringify } from "./Stringify";
import * as BrsError from "./Error";

const interpreter = new Interpreter();

export function execute(filename: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf-8", (err, contents) => {
            if (err) {
                reject(err);
            }
            run(contents);
            if (BrsError.found()) {
                reject("Error occurred");
                if (process.env["NODE_ENV"] !== "test") {
                    // eventually, this probably shouldn't even call process.exit -- it should
                    // happen in cli.js since it's a property of the CLI
                    process.exit(1);
                }
            }
            resolve();
            // TODO: Wire up runtime errors so we can use a second exit code
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

    return interpreter.exec(statements);
}
