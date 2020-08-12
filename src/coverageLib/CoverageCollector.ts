import * as fg from "fast-glob";
import path from "path";
import { table } from "table";
import { createContext } from "istanbul-lib-report";
import { create as createReport } from "istanbul-reports";
import * as IstanbulLibCoverage from "istanbul-lib-coverage";

import { ComponentScopeResolver, Stmt, Expr } from "../parser";
import { ExecutionOptions, Interpreter } from "../interpreter";
import { FileCoverage, FileCoverageReport, CoverageSummary } from "./FileCoverage";
import { LexerParserFn } from "../LexerParser";
import { BrsInvalid, BrsType } from "../brsTypes";

interface CoverageReport {
    File: string;
    Lines: number;
    Covered: number;
    "Uncovered lines": number[];
}

export class CoverageCollector {
    /**
     * map of file paths => FileCoverage objects
     */
    private files = new Map<string, FileCoverage>();

    constructor(
        readonly executionOptions: ExecutionOptions,
        readonly parseFn: (filenames: string[]) => Promise<Stmt.Statement[]>
    ) {}

    public async crawlBrsFiles() {
        let filePattern = path.join(
            this.executionOptions.root,
            "(components|source)",
            "**",
            "*.brs"
        );
        let scripts = fg.sync(filePattern, {});

        scripts.forEach((script) => {
            this.files.set(script, new FileCoverage(script));
        });

        let statements = await this.parseFn(scripts);

        statements.forEach((statement) => {
            let file = this.files.get(statement.location.file);
            if (!file) {
                // TODO: maybe log an error?
                return;
            }

            file.execute(statement);
        });
    }

    public logHit(statement: Expr.Expression | Stmt.Statement) {
        let file = this.files.get(statement.location.file);
        if (!file) {
            return;
        }

        file.logHit(statement);
    }

    public getCoverage() {
        let coverageMapData: { [fileName: string]: CoverageSummary } = {};
        this.files.forEach((file, key) => {
            coverageMapData[key] = file.getCoverage();
        });
        return coverageMapData;
    }
}
