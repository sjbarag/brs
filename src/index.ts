import * as fs from "fs";
import * as readline from "readline";

import { Token, Lexer } from "./lexer";
import * as Parser from "./parser";
import { Interpreter, OutputStreams } from "./interpreter";
import { stringify } from "./Stringify";
import * as BrsError from "./Error";

export { Lexeme, Token, Lexer } from "./lexer";
import * as BrsTypes from "./brsTypes";
export { BrsTypes };

/** The `stdout`/`stderr` pair from the process that invoked `brs`. */
const processOutput: OutputStreams = {
    stdout: process.stdout,
    stderr: process.stderr
};

/**
 * Executes a BrightScript file by path and writes its output to the streams
 * provided in `options`.
 *
 * @param filename the absolute path to the `.brs` file to be executed
 * @param options the streams to use for `stdout` and `stderr`. Mostly used for
 *                testing.
 *
 * @returns a `Promise` that will be resolve if `filename` is successfully
 *          executed, or be rejected if an error occurs.
 */
export async function execute(filenames: string[], options: OutputStreams = processOutput) {
    return new Promise((resolve, reject) => {
        const interpreter = new Interpreter(options); // shared between files

        let brsError;
        for (let filename of filenames) {
            try {
                let contents = fs.readFileSync(filename, "utf-8");
                run(contents, options, interpreter);
                if (BrsError.found()) {
                    brsError = "Error occurred";
                    break;
                }
            } catch (readError) {
                brsError = `brs: can't open file '${filename}': [Errno ${readError.errno}]`;
                break;
            }
        }

        if (brsError == null) {
            resolve();
        } else  {
            reject({
                "message" : brsError
            });
        }
    });
}

/**
 * Launches an interactive read-execute-print loop, which reads input from
 * `stdin` and executes it.
 *
 * **NOTE:** Currently limited to single-line inputs :(
 */
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
            results.map(result => console.log(stringify(result)));
        }

        BrsError.reset();
        rl.prompt();
    });

    rl.prompt();
}

/**
 * Runs an arbitrary string of BrightScript code.
 * @param contents the BrightScript code to lex, parse, and interpret.
 * @param options the streams to use for `stdout` and `stderr`. Mostly used for
 *                testing.
 * @param interpreter an interpreter to use when executing `contents`. Required
 *                    for `repl` to have persistent state between user inputs.
 * @returns an array of statement execution results, indicating why each
 *          statement exited and what its return value was, or `undefined` if
 *          `interpreter` threw an Error.
 */
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
        //options.stderr.write(e.message);
        return;
    }
}
