import { Stmt, Expr } from "../parser";
import { Location, isToken } from "../lexer";
import { BrsInvalid, BrsType, BrsInterface, isIterable } from "../brsTypes";
import { ExitFor } from "../parser/Statement";

interface Line {
    location: Location;
}

interface Branch {
    statement: Stmt.If | Stmt.ElseIf | Stmt.Block;
}

interface File {
    path: string;
    lines: Line[];

    // branches: string[];
    // functions: string[];
    // statements: string[];
}

interface Hits {
    hits: number;
}

interface FunctionCoverage extends Hits {
    statement: Stmt.Function;
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

interface FileCoverageReport {
    lines: number;
    covered: number;
    uncoveredLines: number[];
}

export class FileCoverage {
    private lines = new Map<number, LineCoverage>();

    constructor(readonly filePath: string) {}

    public getCoverage(): FileCoverageReport {
        // console.log(`File: ${this.filePath}`);
        // if (this.filePath.includes("LoginOptionsPage.brs") || this.filePath.includes("Coverage.brs")) {
        //     this.lines.forEach(line => {
        //         console.log(line.lineNumber);
        //         console.log(line.statements);
        //         console.log(line.expressions);
        //     })
        // }

        let coveredLines = 0;
        let uncoveredLines: number[] = [];
        this.lines.forEach(line => {
            if (line.hits > 0) {
                coveredLines++;
            } else {
                uncoveredLines.push(line.lineNumber);
            }
        });

        // console.log(`    Lines: ${this.lines.size}, Covered: ${coveredLines}\n`);

        return {
            lines: this.lines.size,
            covered: coveredLines,
            uncoveredLines
        }
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
                
                // in the event that there are multiple statements on a line, i.e. a single line
                // if-then-else statement, we don't want to count every statement hit as a line hit.
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
        if (!(statement instanceof Stmt.Block || statement instanceof Stmt.Function)) {
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
