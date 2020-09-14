// tslint:disable-next-line
import type { CoverageMapData } from "istanbul-lib-coverage";
import * as fg from "fast-glob";
import path from "path";

import { Stmt, Expr } from "../parser";
import { FileCoverage } from "./FileCoverage";

export class CoverageCollector {
    /**
     * map of file paths => FileCoverage objects
     */
    private files = new Map<string, FileCoverage>();

    constructor(
        readonly projectRoot: string,
        readonly parseFn: (filenames: string[]) => Promise<Stmt.Statement[]>
    ) {}

    async crawlBrsFiles() {
        let filePattern = path.join(this.projectRoot, "(components|source)", "**", "*.brs");
        let scripts = fg.sync(filePattern);

        this.files.clear();
        scripts.forEach((script) => {
            this.files.set(script, new FileCoverage(script));
        });

        let statements = await this.parseFn(scripts);

        statements.forEach((statement) => {
            let file = this.files.get(statement.location.file);
            if (file) {
                file.execute(statement);
            }
        });
    }

    logHit(statement: Expr.Expression | Stmt.Statement) {
        let file = this.files.get(statement.location.file);
        if (file) {
            file.logHit(statement);
        }
    }

    getCoverage() {
        let coverageMapData: CoverageMapData = {};
        this.files.forEach((file, key) => {
            coverageMapData[key] = file.getCoverage();
        });
        return coverageMapData;
    }
}
