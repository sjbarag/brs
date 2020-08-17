import * as fg from "fast-glob";
import path from "path";

import { Stmt, Expr } from "../parser";
import { FileCoverage, CoverageSummary } from "./FileCoverage";

export class CoverageCollector {
    /**
     * map of file paths => FileCoverage objects
     */
    private files = new Map<string, FileCoverage>();

    constructor(
        readonly projectRoot: string,
        readonly parseFn: (filenames: string[]) => Promise<Stmt.Statement[]>
    ) {}

    public async crawlBrsFiles() {
        let filePattern = path.join(
            this.projectRoot,
            "(components|source)",
            "**",
            "*.brs"
        );
        let scripts = fg.sync(filePattern);

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

    public logHit(statement: Expr.Expression | Stmt.Statement) {
        let file = this.files.get(statement.location.file);
        if (file) {
            file.logHit(statement);
        }
    }

    public getCoverage() {
        let coverageMapData: { [fileName: string]: CoverageSummary } = {};
        this.files.forEach((file, key) => {
            coverageMapData[key] = file.getCoverage();
        });
        return coverageMapData;
    }
}
