import * as fg from "fast-glob";
import path from "path";
import { table } from "table";

import { ComponentScopeResolver, Stmt, Expr } from "../parser";
import { ExecutionOptions, Interpreter } from "../interpreter";
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

    public async crawlBrsFiles() {
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

        scripts.forEach((script) => {
            this.files.set(script.uri, new FileCoverage(script.uri));
        });

        let statementCollection = await this.componentScopeResolver.resolveScripts(scripts);

        statementCollection.forEach((statements) => {
            statements.forEach((statement) => {
                let file = this.files.get(statement.location.file);
                if (!file) {
                    return;
                }

                file.addStatement(statement);
            });
        });
    }

    public logStatementHit(statement: Stmt.Statement) {
        let file = this.files.get(statement.location.file);
        if (!file) {
            return;
        }

        file.logStatementHit(statement);
    }

    public logExpressionHit(expression: Expr.Expression) {
        let file = this.files.get(expression.location.file);
        if (!file) {
            return;
        }

        file.logExpressionHit(expression);
    }

    public printCoverage(interpreter: Interpreter) {
        function getPercentStr(num: number, denom: number) {
            if (denom === 0) {
                return `0/0`
            }

            let percent = (num / denom) * 100;
            return `${percent > 0 ? percent.toFixed(2) : 0}% (${num}/${denom})`
        }

        let coverageReport: any[] = [["File", "Lines", "Statements", "Expressions", "Uncovered lines"]];

        // lines
        let lines = 0;
        let coveredLines = 0;

        // files
        let partiallyCoveredFiles: string[] = [];
        let fullyCoveredFiles: string[] = [];

        // statements
        let statements = 0;
        let coveredStatements = 0

        // expressions
        let expressions = 0;
        let coveredExpressions = 0

        this.files.forEach((file) => {
            let relPath = path.posix.relative(this.executionOptions.root, file.filePath);
            let coverage = file.getCoverage();
            coverageReport.push([
                relPath,
                getPercentStr(coverage.coveredLines, coverage.lines),
                getPercentStr(coverage.coveredStatements, coverage.statements),
                getPercentStr(coverage.coveredExpressions, coverage.expressions),
                coverage.coveredLines > 0 ? coverage.uncoveredLineList.join().slice(0, 25): "all"
            ]);

            lines += coverage.lines;
            coveredLines += coverage.coveredLines;

            statements += coverage.statements;
            coveredStatements += coverage.coveredStatements;

            expressions += coverage.expressions;
            coveredExpressions += coverage.coveredExpressions;

            if (coverage.coveredLines > 0) {
                partiallyCoveredFiles.push(relPath);
            }

            if (coverage.lines > 0 && coverage.lines === coverage.coveredLines) {
                fullyCoveredFiles.push(relPath);
            }
        });

        // print full coverage report
        interpreter.stdout.write(
            table(coverageReport, {
                columns: {
                    4: {
                        truncate: 20,
                    },
                },
            })
        );


        // print summary
        interpreter.stdout.write(
            table([
                [
                    "Files",
                    "Partially Covered Files",
                    "Fully Covered Files",
                    "Lines",
                    "Statements",
                    "Expressions",
                ],
                [
                    this.files.size,
                    getPercentStr(partiallyCoveredFiles.length, this.files.size),
                    getPercentStr(fullyCoveredFiles.length, this.files.size),
                    getPercentStr(coveredLines, lines),
                    getPercentStr(coveredStatements, statements),
                    getPercentStr(coveredExpressions, expressions),
                ],
            ])
        );
    }
}
