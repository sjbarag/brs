import * as fg from "fast-glob";
import path from "path";
import { table } from "table";

import { ComponentScopeResolver, Stmt, Expr } from "../parser";
import { ExecutionOptions } from "../interpreter";
import { FileCoverage } from "./FileCoverage";
import { LexerParserFn } from "../LexerParser";
import { BrsInvalid, BrsType } from "../brsTypes";

interface CoverageReport {
    File: string;
    Lines: number;
    Covered: number;
    "Uncovered lines": number[];
}

export class CoverageReporter {
    /**
     * map of file paths => FileCoverage objects
     */
    private files = new Map<string, FileCoverage>();

    constructor(
        readonly executionOptions: ExecutionOptions,
        readonly componentScopeResolver: ComponentScopeResolver
    ) {}

    public async crawlBrsFiles(lexerParserFn: LexerParserFn) {
        let filePattern = path.join(
            this.executionOptions.root,
            "(components|source)",
            "**",
            "*.brs"
        );
        let filePaths = fg.sync(filePattern, {});
        let scripts = filePaths.map((filePath) => {
            return { type: "text/brightscript", uri: filePath };
        });

        // let lexedAndParsed = await lexerParserFn(filePaths);
        // lexedAndParsed.map((statement: Stmt.Statement) => {
        //     if (!(statement instanceof Stmt.Function)) {
        //         console.log("IT'S NOT ONE");
        //     }
        // });

        scripts.forEach((script) => {
            this.files.set(script.uri, new FileCoverage(script.uri));
        });

        let statementCollection = await this.componentScopeResolver.resolveScripts(scripts);

        statementCollection.forEach((statements) => {
            statements.forEach((statement) => {
                // console.log(statement.location);
                let file = this.files.get(statement.location.file);
                if (!file) {
                    return;
                    // throw new Error(
                    //     "No file found for statement. File path: " + statement.location.file
                    // );
                }

                file.addStatement(statement);
            });
        });

        // console.log(this.files);
    }

    public logStatementHit(statement: Stmt.Statement) {
        let file = this.files.get(statement.location.file);
        if (!file) {
            // throw new Error(
            //     "No file found for statement. File path: " + statement.location.file
            // );
            return;
        }

        file.logStatementHit(statement);
    }

    public logExpressionHit(expression: Expr.Expression) {
        let file = this.files.get(expression.location.file);
        if (!file) {
            // throw new Error(
            //     "No file found for statement. File path: " + statement.location.file
            // );
            return;
        }

        file.logExpressionHit(expression);
    }

    public printCoverage(files?: string[]) {
        let coverageReport: any[] = [["File", "Lines", "Covered", "Uncovered lines"]];
        let totalLines = 0;
        let totalCoveredLines = 0;

        let partiallyCoveredFiles: string[] = [];
        let fullyCoveredFiles: string[] = [];
        this.files.forEach((file) => {
            let relPath = path.posix.relative(this.executionOptions.root, file.filePath);
            let coverage = file.getCoverage();
            coverageReport.push([
                relPath,
                coverage.lines,
                coverage.covered,
                coverage.uncoveredLines.join().slice(0, 15),
            ]);

            totalLines += coverage.lines;
            totalCoveredLines += coverage.covered;

            if (coverage.covered > 0) {
                partiallyCoveredFiles.push(relPath);
            }

            if (coverage.lines === coverage.covered) {
                fullyCoveredFiles.push(relPath);
            }
        });

        // print full coverage report
        console.log(
            table(coverageReport, {
                columns: {
                    3: {
                        truncate: 13,
                    },
                },
            })
        );

        // print summary
        console.log(
            table([
                ["Files", "Partially Covered Files", "Fully Covered Files", "Lines", "% Lines Covered"],
                [
                    this.files.size,
                    `${partiallyCoveredFiles.length} (${((partiallyCoveredFiles.length / this.files.size) * 100).toFixed(2)}%)`,
                    `${fullyCoveredFiles.length} (${((fullyCoveredFiles.length / this.files.size) * 100).toFixed(2)}%)`,
                    totalLines,
                    ((totalCoveredLines / totalLines) * 100).toFixed(2)
                ],
            ])
        );
    }
}
