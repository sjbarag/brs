import * as IstanbulLibCoverage from "istanbul-lib-coverage";

import { Stmt, Expr } from "../parser";
import { LineAndColumn, Location, isToken } from "../lexer";
import { BrsInvalid, BrsType } from "../brsTypes";

interface Hits {
    hits: number;
}

interface StatementCoverage extends Hits {
    statement: Stmt.Statement;
}

interface ExpressionCoverage extends Hits {
    expression: Expr.Expression;
}

interface LineCoverage extends Hits {
    lineNumber: number;
    statements: StatementCoverage[];
    expressions: ExpressionCoverage[];
}

export interface FileCoverageReport {
    lines: number;
    coveredLines: number;
    uncoveredLineList: number[];
    statements: number;
    coveredStatements: number;
    expressions: number;
    coveredExpressions: number;
}

export interface IstanbulFileCoverage {
    path: string;
    statementMap: { [key: string]: Location };
    fnMap: { [key: string]: { name: string; decl: Location; loc: Location; line: number } };
    branchMap: {
        [key: string]: { loc: Location; type: string; locations: Location[]; line: number };
    };
    // hit count map for statements
    s: { [key:string]: number };
    // hit count map for functions
    f: { [key:string]: number };
    // hit count map for branches
    b: { [key:string]: number[] };
}

export class FileCoverage {
    private lines = new Map<number, LineCoverage>();

    constructor(readonly filePath: string) {}

    public getCoverage(): FileCoverageReport {
        let coveredLines = 0;
        let uncoveredLineList: number[] = [];
        let statements = 0;
        let coveredStatements = 0;
        let expressions = 0;
        let coveredExpressions = 0;
        this.lines.forEach((line) => {
            if (line.hits > 0) {
                coveredLines++;
            } else {
                uncoveredLineList.push(line.lineNumber);
            }

            statements += line.statements.length;
            expressions += line.expressions.length;

            line.statements.forEach((statement) => {
                if (statement.hits > 0) {
                    coveredStatements++;
                }
            });

            line.expressions.forEach((expression) => {
                if (expression.hits > 0) {
                    coveredExpressions++;
                }
            });
        });

        return {
            lines: this.lines.size,
            coveredLines: coveredLines,
            uncoveredLineList,
            statements,
            coveredStatements,
            expressions,
            coveredExpressions,
        };
    }

    public toIstanbul() {
        let statementMap: { [key: string]: Location } = {};
        let hitMap: { [key: string]: number } = {};

        let data: IstanbulFileCoverage = {
            path: this.filePath,
            statementMap: {},
            fnMap: {},
            branchMap: {},
            // hit count map for statements
            s: {},
            // hit count map for functions
            f: {},
            // hit count map for branches
            b: {},
        };

        this.lines.forEach((line) => {
            line.statements.forEach((statement, index) => {
                let key = `${line.lineNumber}-${index}`;
                if (statement instanceof Stmt.Function) {
                    // do something
                } else {
                    data.statementMap[key] = statement.statement.location;
                    hitMap[key] = statement.hits;
                }
            });
        });

        return new (IstanbulLibCoverage.classes.FileCoverage as any)(data);
    }

    public addStatement(statement: Stmt.Statement) {
        this.execute(statement);
    }

    public logStatementHit(statement: Stmt.Statement) {
        let line = this.getLine(statement.location.start.line);

        line.statements.forEach((existingStatement, index) => {
            if (Location.equals(existingStatement.statement.location, statement.location)) {
                existingStatement.hits++;

                // in the event that there are multiple statements on a line, i.e. a single line
                // if-then-else statement, we don't want to count every statement hit as a line hit.
                if (index === 0) {
                    line!.hits++;
                }
            }
        });

        this.lines.set(line.lineNumber, line);
    }

    public logExpressionHit(expression: Expr.Expression) {
        let line = this.getLine(expression.location.start.line);

        line.expressions.forEach((existingExpr, index) => {
            if (Location.equals(existingExpr.expression.location, expression.location)) {
                existingExpr.hits++;

                // If there's a statement on the line, let statement access be the decider
                // of whether or not this line has been hit. Otherwise, use the first expression.
                if (line.statements.length === 0 && index === 0) {
                    line!.hits++;
                }
            }
        });

        this.lines.set(line.lineNumber, line);
    }

    private getLine(lineNumber: number) {
        if (!this.lines.has(lineNumber)) {
            this.lines.set(lineNumber, { lineNumber, hits: 0, statements: [], expressions: [] });
        }

        return this.lines.get(lineNumber)!;
    }

    private addStatementToLine(statement: Stmt.Statement) {
        // TODO: handle end line
        let line = this.getLine(statement.location.start.line);

        line.statements.push({ hits: 0, statement });
        this.lines.set(line.lineNumber, line);
    }

    private addExpressionToLine(expression: Expr.Expression) {
        // TODO: handle end line
        let line = this.getLine(expression.location.start.line);

        line.expressions.push({ hits: 0, expression });
        this.lines.set(line.lineNumber, line);
    }

    /**
     *  STATEMENTS
     */

    visitAssignment(statement: Stmt.Assignment) {
        this.evaluate(statement.value);
        return BrsInvalid.Instance;
    }

    visitExpression(statement: Stmt.Expression) {
        this.evaluate(statement.expression);
        return BrsInvalid.Instance;
    }

    visitExitFor(statement: Stmt.ExitFor): never {
        throw new Stmt.ExitForReason(statement.location);
    }

    visitExitWhile(statement: Stmt.ExitWhile): never {
        throw new Stmt.ExitWhileReason(statement.location);
    }

    visitPrint(statement: Stmt.Print) {
        statement.expressions.forEach((exprOrToken) => {
            if (!isToken(exprOrToken)) {
                this.evaluate(exprOrToken);
            }
        });
        return BrsInvalid.Instance;
    }

    visitIf(statement: Stmt.If) {
        this.evaluate(statement.condition);
        this.execute(statement.thenBranch);

        statement.elseIfs.forEach((elseIf) => {
            this.addStatementToLine(elseIf.thenBranch);
            this.evaluate(elseIf.condition);
            this.execute(elseIf.thenBranch);
        });

        if (statement.elseBranch) {
            this.addStatementToLine(statement.elseBranch);
            this.execute(statement.elseBranch);
        }

        return BrsInvalid.Instance;
    }

    visitBlock(block: Stmt.Block) {
        block.statements.forEach((statement) => this.execute(statement));
        return BrsInvalid.Instance;
    }

    visitFor(statement: Stmt.For) {
        this.execute(statement.counterDeclaration);
        this.evaluate(statement.counterDeclaration.value);
        this.evaluate(statement.finalValue);
        this.evaluate(statement.increment);
        this.execute(statement.body);

        return BrsInvalid.Instance;
    }

    visitForEach(statement: Stmt.ForEach) {
        this.evaluate(statement.target);
        this.execute(statement.body);

        return BrsInvalid.Instance;
    }

    visitWhile(statement: Stmt.While) {
        this.evaluate(statement.condition);
        this.execute(statement.body);

        return BrsInvalid.Instance;
    }

    visitNamedFunction(statement: Stmt.Function) {
        statement.func.body.statements.forEach((stmt) => this.execute(stmt));
        return BrsInvalid.Instance;
    }

    visitReturn(statement: Stmt.Return): never {
        if (!statement.value) {
            throw new Stmt.ReturnValue(statement.tokens.return.location);
        }

        let toReturn = this.evaluate(statement.value);
        throw new Stmt.ReturnValue(statement.tokens.return.location, toReturn);
    }

    visitDottedSet(statement: Stmt.DottedSet) {
        this.evaluate(statement.obj);
        this.evaluate(statement.value);

        return BrsInvalid.Instance;
    }

    visitIndexedSet(statement: Stmt.IndexedSet) {
        this.evaluate(statement.obj);
        this.evaluate(statement.index);
        this.evaluate(statement.value);

        return BrsInvalid.Instance;
    }

    visitIncrement(statement: Stmt.Increment) {
        this.evaluate(statement.value);

        return BrsInvalid.Instance;
    }

    visitLibrary(statement: Stmt.Library) {
        return BrsInvalid.Instance;
    }

    /**
     * EXPRESSIONS
     */

    visitBinary(expression: Expr.Binary) {
        this.evaluate(expression.left);
        this.evaluate(expression.right);
        return BrsInvalid.Instance;
    }

    visitCall(expression: Expr.Call) {
        this.evaluate(expression.callee);
        expression.args.map(this.evaluate, this);

        return BrsInvalid.Instance;
    }

    visitAnonymousFunction(func: Expr.Function) {
        return BrsInvalid.Instance;
    }

    visitDottedGet(expression: Expr.DottedGet) {
        this.evaluate(expression.obj);
        return BrsInvalid.Instance;
    }

    visitIndexedGet(expression: Expr.IndexedGet) {
        this.evaluate(expression.obj);
        this.evaluate(expression.index);
        return BrsInvalid.Instance;
    }

    visitGrouping(expression: Expr.Grouping) {
        this.evaluate(expression.expression);
        return BrsInvalid.Instance;
    }

    visitLiteral(expression: Expr.Literal) {
        return BrsInvalid.Instance;
    }

    visitArrayLiteral(expression: Expr.ArrayLiteral) {
        expression.elements.forEach((expr) => this.evaluate(expr));
        return BrsInvalid.Instance;
    }

    visitAALiteral(expression: Expr.AALiteral) {
        expression.elements.forEach((member) => this.evaluate(member.value));
        return BrsInvalid.Instance;
    }

    visitUnary(expression: Expr.Unary) {
        this.evaluate(expression.right);
        return BrsInvalid.Instance;
    }

    visitVariable(expression: Expr.Variable) {
        return BrsInvalid.Instance;
    }

    private evaluate(this: FileCoverage, expression: Expr.Expression) {
        this.addExpressionToLine(expression);
        return expression.accept<BrsType>(this);
    }

    private execute(this: FileCoverage, statement: Stmt.Statement): BrsType {
        if (!(statement instanceof Stmt.Block)) {
            this.addStatementToLine(statement);
        }

        try {
            return statement.accept<BrsType>(this);
        } catch (err) {
            if (
                !(
                    err instanceof Stmt.ReturnValue ||
                    err instanceof Stmt.ExitFor ||
                    err instanceof Stmt.ExitForReason ||
                    err instanceof Stmt.ExitWhile ||
                    err instanceof Stmt.ExitWhileReason
                )
            ) {
                throw err;
            }
        }

        return BrsInvalid.Instance;
    }
}
