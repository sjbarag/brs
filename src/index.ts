import * as fs from "fs";
import * as readline from "readline";

import { Token } from "./Token";
import * as Lexer from "./lexer";
import * as Parser from "./parser";
import { AstPrinter } from "./interpreter/AstPrinter";
import { Interpreter, OutputStreams } from "./interpreter";
import { stringify } from "./Stringify";
import * as BrsError from "./Error";

/** The `stdout`/`stderr` pair from the process that invoked `brs`. */
const processOutput: OutputStreams = {
    stdout: process.stdout,
    stderr: process.stderr
};

export function execute(filename: string, options: OutputStreams = processOutput) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf-8", (err, contents) => {
            if (err) {
                reject({
                    "message" : `brs: can't open file '${filename}': [Errno ${err.errno}]`
                });
            } else {
                run(contents, options);
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
    const replInterpreter = new Interpreter();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.setPrompt("brs> ");

    rl.on("line", (line) => {
        let results = run(line, processOutput, replInterpreter);
        if (results) {
            results.map(result => console.log(stringify(result.value)));
        }

        BrsError.reset();
        rl.prompt();
    });

    rl.prompt();
}

function run(contents: string, options: OutputStreams = processOutput, interpreter?: Interpreter) {
    const tokens: ReadonlyArray<Token> = Lexer.scan(contents);
    const statements = Parser.parse(tokens);

    if (BrsError.found()) {
        return;
    }

    if (!statements) { return; }

    try {
        return (interpreter || new Interpreter(options)).exec(statements);
    } catch (e) {
        options.stderr.write(e.message);
        return;
    }
}
