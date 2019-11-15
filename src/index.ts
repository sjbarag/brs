import * as fs from "fs";
import * as readline from "readline";

import { Lexer } from "./lexer";
import * as PP from "./preprocessor";
import {
    getComponentDefinitionMap,
    ComponentDefinition,
    ComponentScript,
} from "./componentprocessor";
import { Parser } from "./parser";
import { Interpreter, ExecutionOptions, defaultExecutionOptions } from "./interpreter";
import * as BrsError from "./Error";
import * as LexerParser from "./LexerParser";

import * as _lexer from "./lexer";
export { _lexer as lexer };
import * as BrsTypes from "./brsTypes";
export { BrsTypes as types };
export { PP as preprocessor };
import * as _parser from "./parser";
export { _parser as parser };
import { URL } from "url";
import * as path from "path";

/**
 * Executes a BrightScript file by path and writes its output to the streams
 * provided in `options`.
 *
 * @param filename the absolute path to the `.brs` file to be executed
 * @param options configuration for the execution, including the streams to use for `stdout` and
 *                `stderr` and the base directory for path resolution
 *
 * @returns a `Promise` that will be resolve if `filename` is successfully
 *          executed, or be rejected if an error occurs.
 */
export async function execute(filenames: string[], options: Partial<ExecutionOptions>) {
    const executionOptions = Object.assign(defaultExecutionOptions, options);

    let manifest = await PP.getManifest(executionOptions.root);
    let componentDefinitions = await getComponentDefinitionMap(executionOptions.root);

    let pathFormatter = (component: ComponentDefinition) => {
        if (component.scripts.length < 1) return;
        component.scripts = component.scripts.map((script: ComponentScript) => {
            script.uri = path.join(
                options.root ? options.root : __dirname,
                new URL(script.uri).pathname
            );
            return script;
        });
    };

    let lexerParserFn = LexerParser.getLexerParserFn(manifest);
    const interpreter = await Interpreter.withSubEnvsFromComponents(
        componentDefinitions,
        pathFormatter,
        lexerParserFn
    );
    if (!interpreter) {
        throw new Error("Unable to build interpreter with given component definitions.");
    }

    let mainStatements = await lexerParserFn(filenames);
    return interpreter.exec(mainStatements);
}

/**
 * A synchronous version of the lexer-parser flow.
 *
 * @param filename the paths to BrightScript files to lex and parse synchronously
 * @param options configuration for the execution, including the streams to use for `stdout` and
 *                `stderr` and the base directory for path resolution
 *
 * @returns the AST produced from lexing and parsing the provided files
 */
export function lexParseSync(filenames: string[], options: Partial<ExecutionOptions>) {
    const executionOptions = Object.assign(defaultExecutionOptions, options);

    let manifest = PP.getManifestSync(executionOptions.root);

    return filenames
        .map(filename => {
            let contents = fs.readFileSync(filename, "utf8");
            let scanResults = Lexer.scan(contents, filename);
            let preprocessor = new PP.Preprocessor();
            let preprocessorResults = preprocessor.preprocess(scanResults.tokens, manifest);
            return Parser.parse(preprocessorResults.processedTokens).statements;
        })
        .reduce((allStatements, statements) => [...allStatements, ...statements], []);
}

/**
 * Launches an interactive read-execute-print loop, which reads input from
 * `stdin` and executes it.
 *
 * **NOTE:** Currently limited to single-line inputs :(
 */
export function repl() {
    const replInterpreter = new Interpreter();
    replInterpreter.onError(BrsError.logError);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.setPrompt("brs> ");
    rl.on("line", line => {
        if (line.toLowerCase() === "quit" || line.toLowerCase() === "exit") {
            process.exit();
        }
        let results = run(line, defaultExecutionOptions, replInterpreter);
        if (results) {
            results.map(result => {
                if (result !== BrsTypes.BrsInvalid.Instance) {
                    console.log(result.toString());
                }
            });
        }
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
function run(
    contents: string,
    options: ExecutionOptions = defaultExecutionOptions,
    interpreter: Interpreter
) {
    const lexer = new Lexer();
    const parser = new Parser();

    lexer.onError(BrsError.logError);
    parser.onError(BrsError.logError);

    const scanResults = lexer.scan(contents, "REPL");
    if (scanResults.errors.length > 0) {
        return;
    }

    const parseResults = parser.parse(scanResults.tokens);
    if (parseResults.errors.length > 0) {
        return;
    }

    if (parseResults.statements.length === 0) {
        return;
    }

    try {
        return interpreter.exec(parseResults.statements);
    } catch (e) {
        //options.stderr.write(e.message);
        return;
    }
}
