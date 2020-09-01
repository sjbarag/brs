import { Stmt, Expr } from "../parser";
import { Location, isToken } from "../lexer";
import { BrsInvalid, BrsType } from "../brsTypes";
import { isStatement } from "../parser/Statement";

interface StatementCoverage {
    /** Number of times the interpreter has executed/evaluated this statement. */
    hits: number;
    /** Combine expressions and statements because we need to log some expressions to get the coverage report. */
    statement: Expr.Expression | Stmt.Statement;
}

export interface CoverageSummary {
    path: string;
    statements: { [key: string]: { hits: number; location: Location; }; };
    functions: {
        [key: string]: { hits: number; location: Location; name: string; };
    };
    branches: {
        [key: string]: {
            hits: number[];
            locations: Location[];
            /** Branch type, i.e. "if", "or", "and", etc. */
            type: string;
        };
    };
}

export class FileCoverage {
    private statements = new Map<string, StatementCoverage>();

    constructor(readonly filePath: string) { }

    /**
     * Returns the StatementCoverage object for a given statement.
     * @param statement statement for which to get coverage.
     */
    private get(statement: Expr.Expression | Stmt.Statement) {
        let key = this.getStatementKey(statement);
        return this.statements.get(key);
    }

    /**
     * Creates a StatementCoverage object for a given statement.
     * @param statement statement to add.
     */
    private add(statement: Expr.Expression | Stmt.Statement) {
        let key = this.getStatementKey(statement);
        this.statements.set(key, { hits: 0, statement });
    }

    /**
     * Generates a key for the statement using its location and type.
     * @param statement statement for which to generate a key.
     */
    private getStatementKey(statement: Expr.Expression | Stmt.Statement) {
        let { start, end } = statement.location;
        return `${statement.type}:${start.line},${start.column}-${end.line},${end.column}`;
    }

    /**
     * Logs a hit to a particular statement, indicating the statement was used.
     * @param statement statement for which to log a hit
     */
    logHit(statement: Expr.Expression | Stmt.Statement) {
        let coverage = this.get(statement);
        if (coverage) {
            coverage.hits++;
        }
    }

    /**
     * Converts the coverage data to a POJO that's more friendly for consumers.
     */
    getCoverage(): CoverageSummary {
        let coverageSummary: CoverageSummary = {
            path: this.filePath,
            statements: {},
            functions: {},
            branches: {},
        };

        this.statements.forEach(({ statement, hits }, key) => {
            if (statement instanceof Stmt.If) {
                let locations: Location[] = [];
                let branchHits: number[] = [];

                // Add the "if" coverage
                locations.push(statement.location);
                branchHits.push(hits);

                // Add the "else if" coverage
                statement.elseIfs.forEach((branch, index) => {
                    let elseIfCoverage = this.get(branch.condition);
                    if (elseIfCoverage) {
                        // use the tokens as the start rather than the condition
                        let start =
                            statement.tokens.elseIfs?.[index].location.start ||
                            branch.condition.location.start;
                        locations.push({ ...branch.condition.location, start });
                        branchHits.push(elseIfCoverage.hits);
                    }
                });

                // Add the "else" coverage
                if (statement.elseBranch) {
                    let elseCoverage = this.get(statement.elseBranch);
                    if (elseCoverage) {
                        // use the tokens as the start rather than the condition
                        let start =
                            statement.tokens.else?.location.start ||
                            statement.elseBranch.location.start;
                        locations.push({ ...statement.elseBranch.location, start });
                        branchHits.push(elseCoverage.hits);
                    }
                }

                coverageSummary.branches[key] = {
                    hits: branchHits,
                    locations,
                    type: "if",
                };
            } else if (statement instanceof Expr.Function) {
                coverageSummary.functions[key] = {
                    hits,
                    location: statement.location,
                    name: statement.keyword.text,
                };
            } else if (statement instanceof Expr.Binary) {
                let locations: Location[] = [];
                let branchHits: number[] = [];

                let leftCoverage = this.get(statement.left);
                if (leftCoverage) {
                    locations.push(statement.left.location);
                    branchHits.push(leftCoverage.hits);
                }
                let rightCoverage = this.get(statement.right);
                if (rightCoverage) {
                    locations.push(statement.right.location);
                    branchHits.push(rightCoverage.hits);
                }

                coverageSummary.branches[key] = {
                    hits: branchHits,
                    locations,
                    type: statement.token.kind,
                };
            } else if (isStatement(statement)) {
                coverageSummary.statements[key] = {
                    hits,
                    location: statement.location
                };
            }
        });

        return coverageSummary;
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
            this.add(elseIf.thenBranch);
            this.evaluate(elseIf.condition);
            this.execute(elseIf.thenBranch);
        });

        if (statement.elseBranch) {
            this.add(statement.elseBranch);
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
        this.evaluate(statement.func);
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
        expression.args.map(this.evaluate, this);
        return BrsInvalid.Instance;
    }

    visitAnonymousFunction(func: Expr.Function) {
        func.body.statements.forEach((stmt) => this.execute(stmt));
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

    evaluate(this: FileCoverage, expression: Expr.Expression) {
        this.add(expression);
        return expression.accept<BrsType>(this);
    }

    execute(this: FileCoverage, statement: Stmt.Statement): BrsType {
        // don't double-count functions -- we'll count them when we get Expr.Function
        if (!(statement.type === "NamedFunction")) {
            this.add(statement);
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
