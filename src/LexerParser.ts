import * as fs from "fs";
import { promisify } from "util";
import pSettle from "p-settle";
const readFile = promisify(fs.readFile);

import { Lexer } from "./lexer";
import * as PP from "./preprocessor";
import { Parser } from "./parser";

import * as _lexer from "./lexer";
export { _lexer as lexer };
import * as BrsTypes from "./brsTypes";
export { BrsTypes as types };
export { PP as preprocessor };
import * as _parser from "./parser";
export { _parser as parser };
import { ManifestValue } from "./preprocessor/Manifest";
import * as BrsError from "./Error";

export function getLexerParserFn(manifest: Map<string, ManifestValue>) {
    return async function parse(filenames: string[]): Promise<_parser.Stmt.Statement[]> {
        let parsedFiles = await pSettle(
            filenames.map(async filename => {
                let contents;
                try {
                    contents = await readFile(filename, "utf-8");
                } catch (err) {
                    return Promise.reject({
                        message: `brs: can't open file '${filename}': [Errno ${err.errno}]`,
                    });
                }

                let lexer = new Lexer();
                let preprocessor = new PP.Preprocessor();
                let parser = new Parser();
                [lexer, preprocessor, parser].forEach(emitter =>
                    emitter.onError(BrsError.logError)
                );

                let scanResults = lexer.scan(contents, filename);
                if (scanResults.errors.length > 0) {
                    return Promise.reject({
                        message: "Error occurred during lexing",
                    });
                }

                let preprocessResults = preprocessor.preprocess(scanResults.tokens, manifest);
                if (preprocessResults.errors.length > 0) {
                    return Promise.reject({
                        message: "Error occurred during pre-processing",
                    });
                }

                let parseResults = parser.parse(preprocessResults.processedTokens);
                if (parseResults.errors.length > 0) {
                    return Promise.reject({
                        message: "Error occurred parsing",
                    });
                }

                return Promise.resolve(parseResults.statements);
            })
        );

        // don't execute anything if there were reading, lexing, or parsing errors
        if (parsedFiles.some(file => file.isRejected)) {
            return Promise.reject({
                messages: parsedFiles
                    .filter(file => file.isRejected)
                    .map(rejection => rejection.reason.message),
            });
        }

        // combine statements from all files into one array
        return parsedFiles
            .map(file => file.value || [])
            .reduce((allStatements, fileStatements) => [...allStatements, ...fileStatements], []);
    };
}
