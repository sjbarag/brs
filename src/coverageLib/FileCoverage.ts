import { Stmt, Expr } from "../parser";
import { Location, isToken, Lexeme } from "../lexer";
import { BrsInvalid, BrsType } from "../brsTypes";
import { StatementKind, Expression } from "../parser/Statement";

interface StatementCoverage {
    /** Number of times the interpreter has executed/evaluated this statement. */
    hits: number;
    /** Combine expressions and statements because we need to log some expressions to get the coverage report. */
    statement: Expr.Expression | Stmt.Statement;
    /** Keep track of whether we've already used this statement in the coverage report. */
    used: boolean;
}

export interface CoverageSummary {
    path: string;
    statementMap: { [key: string]: Location };
    fnMap: { [key: string]: { name: string; decl: Location; loc: Location; line: number } };
    branchMap: {
        [key: string]: { loc: Location; type: string; locations: Location[]; line: number };
    };
    // hit count map for statements
    s: { [key: string]: number };
    // hit count map for functions
    f: { [key: string]: number };
    // hit count map for branches
    b: { [key: string]: number[] };
}

export class FileCoverage {
    private lines = new Map<number, StatementCoverage[]>();

    constructor(readonly filePath: string) {}

    private getLine(lineNumber: number) {
        if (!this.lines.has(lineNumber)) {
            this.lines.set(lineNumber, []);
        }
        return this.lines.get(lineNumber)!;
    }

    logHit(statement: Expr.Expression | Stmt.Statement) {
        let lineNumber = statement.location.start.line;
        let lineStatements = this.getLine(lineNumber);
        this.lines.set(
            lineNumber,
            lineStatements.map((existingStatement) => {
                if (
                    existingStatement.statement.kind === statement.kind &&
                    Location.equals(existingStatement.statement.location, statement.location)
                ) {
                    existingStatement.hits++;
                }
                return existingStatement;
            })
        );
    }

    addStatementToLine(statement: Expr.Expression | Stmt.Statement) {
        let lineNumber = statement.location.start.line;
        let lineStatements = this.getLine(lineNumber);
        lineStatements.push({ hits: 0, statement, used: false });
        this.lines.set(lineNumber, lineStatements);
    }

    private getStatement(statement: Stmt.Statement | Expr.Expression) {
        return this.getLine(statement.location.start.line).find((other) => {
            other.statement.kind === statement.kind &&
                Location.equals(other.statement.location, statement.location);
        });
    }

    /**
     * Converts the coverage data to a POJO that is more friendly for consumers like istanbul.
     */
    getCoverage(): CoverageSummary {
        let coverageSummary: CoverageSummary = {
            path: this.filePath,
            statementMap: {},
            fnMap: {},
            branchMap: {},
            s: {},
            f: {},
            b: {},
        };


        Array.from(this.lines).forEach(([lineNumber, statements]) => {
            statements.forEach(({ statement, hits, used }, index) => {
                // Don't double-count statements.
                if (used) return;

                // unique key for this statement
                let key = `line-${lineNumber}/stmt-${index}`;
                if (statement instanceof Stmt.If) {
                    let locations: Location[] = [];
                    let branchHits: number[] = [];

                    // first add the if statement
                    let ifStatement = this.getLine((statement.condition.location.start.line)).find((branchStatement) => 
                        branchStatement.statement.kind === statement.condition.kind &&
                        Location.equals(branchStatement.statement.location, statement.condition.location)
                    );
                    let ifStatement = this.getStatement(statement.condition);
                    if (ifStatement) {
                        locations.push(ifStatement.statement.location);
                        branchHits.push(ifStatement.hits);
                    }

                    // then add the else-ifs
                    statement.elseIfs.forEach((branch, index) => {
                        let branchStatements = this.getLine(branch.condition.location.start.line);
                        let elseIf = branchStatements.find((branchStatement) =>
                            Location.equals(branch.condition.location, branchStatement.statement.location)
                        );

                        let tokenLocation = statement.tokens.elseIfs?.[index]?.location;
                        if (tokenLocation && elseIf) {
                            locations.push(tokenLocation);
                            branchHits.push(elseIf.hits);
                            
                        }
                    });

                    // then add the else
                    if (statement.elseBranch) {
                        let elseBranchLocation = statement.elseBranch.location;
                        let elseBlock = this.getLine(elseBranchLocation.start.line).find((stmt) =>
                            Location.equals(elseBranchLocation, stmt.statement.location)
                        );

                        let tokenLocation = statement.tokens.else?.location;
                        if (tokenLocation && elseBlock) {
                            locations.push(tokenLocation);
                            branchHits.push(elseBlock.hits);
                        }
                    }

                    coverageSummary.branchMap[key] = {
                        loc: statement.location,
                        type: "if",
                        locations,
                        line: lineNumber,
                    };
                    coverageSummary.b[key] = branchHits;
                } else if (statement instanceof Expr.Function) {
                    coverageSummary.fnMap[key] = {
                        name: statement.keyword.text,
                        decl: statement.location,
                        loc: statement.location,
                        line: lineNumber,
                    };
                    coverageSummary.f[key] = hits;
                } else if (statement instanceof Expr.Binary) {
                    let locations: Location[] = [];
                    let branchHits: number[] = [];
                    [statement.left, statement.right].forEach((branch) => {
                        let branchCov = this.getLine(branch.location.start.line).find((stmt) => {
                            stmt.statement.kind === branch.kind &&
                                Location.equals(stmt.statement.location, branch.location);
                        });
                        if (branchCov) {
                            locations.push(branchCov.statement.location);
                            branchHits.push(branchCov.hits);
                        }
                    });
                    coverageSummary.branchMap[key] = {
                        loc: statement.location,
                        type: statement.token.kind,
                        locations,
                        line: lineNumber,
                    };
                    coverageSummary.b[key] = branchHits;
                } else {
                    coverageSummary.statementMap[key] = statement.location;
                    coverageSummary.s[key] = hits;
                }
            });
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
        this.addStatementToLine(expression);
        return expression.accept<BrsType>(this);
    }

    execute(this: FileCoverage, statement: Stmt.Statement): BrsType {
        // don't double-count functions -- we'll count them when we get Expr.Function
        if (!(statement.kind === StatementKind.NamedFunction)) {
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
