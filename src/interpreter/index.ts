import Long from "long";

import {
    BrsType,
    BrsString,
    ValueKind,
    BrsInvalid,
    isBrsNumber,
    isBrsString,
    BrsBoolean,
    isBrsBoolean,
    Int32,
    Int64,
    Float,
    Double
} from "../brsTypes";

import * as Expr from "../parser/Expression";
import * as Stmt from "../parser/Statement";
import { Lexeme } from "../Lexeme";
import { stringify } from "../Stringify";
import * as BrsError from "../Error";

import Environment from "./Environment";

export class Interpreter implements Expr.Visitor<BrsType>, Stmt.Visitor<BrsType> {
    private environment = new Environment();

    exec(statements: Stmt.Statement[]) {
        return statements.map((statement) => this.execute(statement));
    }

    visitAssign(statement: Expr.Assign): BrsType {
        return BrsInvalid.Instance;
    }

    visitExpression(statement: Stmt.Expression): Stmt.Result {
        return {
            value: this.evaluate(statement.expression),
            reason: Stmt.StopReason.End
        };
    }

    visitPrint(statement: Stmt.Print): Stmt.Result {
        let result = this.evaluate(statement.expression);
        console.log(stringify(result));
        return {
            value: BrsInvalid.Instance,
            reason: Stmt.StopReason.End
        };
    }

    visitAssignment(statement: Stmt.Assignment): Stmt.Result {
        let value = this.evaluate(statement.value);
        this.environment.define(statement.name.text!, value);
        return {
            value: BrsInvalid.Instance,
            reason: Stmt.StopReason.End
        }
    }

    visitBinary(expression: Expr.Binary) {
        let lexeme = expression.token.kind;
        let left = this.evaluate(expression.left);
        let right: BrsType = BrsInvalid.Instance;

        if (lexeme !== Lexeme.And && lexeme !== Lexeme.Or) {
            // don't evaluate right-hand-side of boolean expressions, to preserve short-circuiting
            // behavior found in other languages. e.g. `foo() && bar()` won't execute `bar()` if
            // `foo()` returns `false`.
            right = this.evaluate(expression.right);
        }

        switch (lexeme) {
            case Lexeme.Minus:
                if (isBrsNumber(left) && isBrsNumber(right)) {
                    return left.subtract(right);
                } else {
                    BrsError.make(
                        `Attempting to subtract non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                }
            case Lexeme.Star:
                if (isBrsNumber(left) && isBrsNumber(right)) {
                    return left.multiply(right);
                } else {
                    BrsError.make(
                        `Attempting to multiply non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                }
            case Lexeme.Caret:
                if (isBrsNumber(left) && isBrsNumber(right)) {
                    return left.pow(right);
                } else {
                    BrsError.make(
                        `Attempting to exponentiate non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                }
            case Lexeme.Slash:
                if (isBrsNumber(left) && isBrsNumber(right)) {
                    return left.divide(right);
                }
                BrsError.make(
                    `Attempting to divide non-numeric objects.
                    left: ${typeof left}
                    right: ${typeof right}`,
                    expression.token.line
                );
                return BrsInvalid.Instance;
            case Lexeme.Mod:
                if (isBrsNumber(left) && isBrsNumber(right)) {
                    return left.modulo(right);
                } else {
                    BrsError.make(
                        `Attempting to modulo non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                }
            case Lexeme.Backslash:
                if (isBrsNumber(left) && isBrsNumber(right)) {
                    return left.intDivide(right);
                } else {
                    BrsError.make(
                        `Attempting to integer-divide non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                }
            case Lexeme.Plus:
                if (isBrsNumber(left) && isBrsNumber(right)) {
                    return left.add(right);
                } else if (isBrsString(left) && isBrsString(right)) {
                    return left.concat(right);
                } else {
                    BrsError.make(
                        `Attempting to add non-homogeneous objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                }
            case Lexeme.Greater:
                return left.greaterThan(right);
            case Lexeme.GreaterEqual:
                return left.greaterThan(right).or(left.equalTo(right));
            case Lexeme.Less:
                return left.lessThan(right);
            case Lexeme.LessEqual:
                return left.lessThan(right).or(left.equalTo(right));
            case Lexeme.Equal:
                return left.equalTo(right);
            case Lexeme.LessGreater:
                return left.equalTo(right).not();
            case Lexeme.And:
                if (isBrsBoolean(left) && !left.toBoolean()) {
                    // short-circuit ANDs - don't evaluate RHS if LHS is false
                    return BrsBoolean.False;
                } else if (isBrsBoolean(left)) {
                    right = this.evaluate(expression.right);
                    if (isBrsBoolean(right)) {
                        return (left as BrsBoolean).and(right);
                    }

                    BrsError.make(
                        `Attempting to 'and' boolean with non-boolean expression
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                } else if (isBrsNumber(left)) {
                    right = this.evaluate(expression.right);

                    if (isBrsNumber(right)) {
                        // TODO: support boolean AND with numbers
                        return left.and(right);
                    }

                    // TODO: figure out how to handle 32-bit int AND 64-bit int
                    BrsError.make(
                        `Attempting to bitwise 'and' number with non-numeric expression
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                } else {
                    BrsError.make(
                        `Attempting to 'and' unexpected expressions
                        left: ${typeof left},
                        right: ${typeof this.evaluate(expression.right)}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                }
            case Lexeme.Or:
                if (isBrsBoolean(left) && left.toBoolean()) {
                    // short-circuit ORs - don't evaluate RHS if LHS is true
                    return BrsBoolean.True;
                } else if (isBrsBoolean(left)) {
                    right = this.evaluate(expression.right);
                    if (isBrsBoolean(right)) {
                        return (left as BrsBoolean).or(right);
                    } else {
                        BrsError.make(
                            `Attempting to 'or' boolean with non-boolean expression
                            right: ${typeof right}`,
                            expression.token.line
                        );
                        return BrsInvalid.Instance;
                    }
                } else if (isBrsNumber(left)) {
                    right = this.evaluate(expression.right);
                    if (isBrsNumber(right)) {
                        return left.or(right);
                    }

                    // TODO: figure out how to handle 32-bit int OR 64-bit int
                    BrsError.make(
                        `Attempting to bitwise 'or' number with non-numeric expression
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                } else {
                    BrsError.make(
                        `Attempting to 'or' unexpected objects
                        left: ${typeof left},
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return BrsInvalid.Instance;
                }
            default:
                BrsError.make(
                    `Received unexpected token kind '${expression.token.kind}'`,
                    expression.token.line
                );
                return BrsInvalid.Instance;
        }
    }

    visitBlock(block: Stmt.Block): Stmt.Result {
        let stopReason = Stmt.StopReason.End;

        eachStatement:
        for (const statement of block.statements) {
            const stmtResult = this.execute(statement);

            if (BrsError.found()) {
                // this might need to actually throw
                stopReason = Stmt.StopReason.Error;
                break;
            } else {
                switch (stmtResult.reason) {
                    case Stmt.StopReason.ExitFor:
                    case Stmt.StopReason.ExitWhile:
                        stopReason = stmtResult.reason;
                        break eachStatement;
                    default:
                        continue;
                }
            }
        }

        return {
            value: BrsInvalid.Instance,
            reason: stopReason
        };
    }

    visitExitFor(statement: Stmt.ExitFor) {
        return {
            value: BrsInvalid.Instance,
            reason: Stmt.StopReason.ExitFor
        };
    }

    visitExitWhile(expression: Stmt.ExitWhile) {
        return {
            value: BrsInvalid.Instance,
            reason: Stmt.StopReason.ExitWhile
        };
    }

    visitCall(expression: Expr.Call) {
        // evaluate the function to call (it could be the result of another function call)
        const callee = this.evaluate(expression.callee);
        // evaluate all of the arguments as well (they could also be function calls)
        const args = expression.args.map(this.evaluate);

        return BrsInvalid.Instance;
    }
    visitGet(expression: Expr.Get) {
        return BrsInvalid.Instance;
    }

    visitGrouping(expr: Expr.Grouping) {
        return this.evaluate(expr.expression);
    }

    visitFor(statement: Stmt.For): Stmt.Result {
        // BrightScript for/to loops evaluate the counter initial value, final value, and increment
        // values *only once*, at the top of the for/top loop.
        this.execute(statement.counterDeclaration);
        const finalValue = this.evaluate(statement.finalValue);
        const increment = this.evaluate(statement.increment);

        const counterName = statement.counterDeclaration.name;
        const step = new Stmt.Assignment(
            counterName,
            new Expr.Binary(
                new Expr.Variable(counterName),
                { kind: Lexeme.Plus, text: "+", line: counterName.line },
                new Expr.Literal(increment)
            )
        );

        let blockResult: Stmt.Result = {
            value: BrsInvalid.Instance,
            reason: Stmt.StopReason.End
        };

        while (
            this.evaluate(new Expr.Variable(counterName))
                .equalTo(finalValue)
                .not()
                .toBoolean()
        ) {
            // execute the block
            blockResult = this.execute(statement.body);
            if (blockResult.reason === Stmt.StopReason.ExitFor) {
                break;
            }

            // then increment the counter
            this.execute(step);
        }

        // BrightScript for/to loops execute the body one more time when initial === final
        if (blockResult.reason === Stmt.StopReason.End) {
            blockResult = this.execute(statement.body);
            // they also increments the counter once more
            this.execute(step);
        }

        return blockResult;
    }

    visitWhile(statement: Stmt.While): Stmt.Result {
        while (this.evaluate(statement.condition).equalTo(BrsBoolean.True).toBoolean()) {
            const blockResult = this.execute(statement.body);
            if (blockResult.reason !== Stmt.StopReason.End) {
                break;
            }
        }

        return {
            value: BrsInvalid.Instance,
            reason: Stmt.StopReason.End
        };
    }

    visitIf(statement: Stmt.If): Stmt.Result {
        if (this.evaluate(statement.condition).equalTo(BrsBoolean.True).toBoolean()) {
            const thenResult = this.execute(statement.thenBranch);
            return {
                value: BrsInvalid.Instance,
                reason: thenResult.reason
            };
        } else {
            for (const elseIf of statement.elseIfs || []) {
                if (this.evaluate(elseIf.condition).equalTo(BrsBoolean.True).toBoolean()) {
                    const elseIfResult = this.execute(elseIf.thenBranch);
                    return {
                        value: BrsInvalid.Instance,
                        reason: elseIfResult.reason
                    };
                }
            }

            let stopReason = Stmt.StopReason.End;
            if (statement.elseBranch) {
                const elseResult = this.execute(statement.elseBranch);
                stopReason = elseResult.reason;
            }
            return {
                value: BrsInvalid.Instance,
                reason: stopReason
            };
        }
    }

    visitLiteral(expression: Expr.Literal): BrsType {
        return expression.value;
    }

    visitLogical(expression: Expr.Logical) {
        return BrsInvalid.Instance;
    }
    visitM(expression: Expr.M) {
        return BrsInvalid.Instance;
    }
    visitSet(expression: Expr.Set) {
        return BrsInvalid.Instance;
    }

    visitUnary(expression: Expr.Unary) {
        let right = this.evaluate(expression.right);

        switch (expression.operator.kind) {
            case Lexeme.Minus:
                if (isBrsNumber(right)) {
                    return right.multiply(new Int32(-1));
                } else {
                    BrsError.make(
                        `Attempting to negate non-numeric value.
                        value type: ${typeof right}`,
                        expression.operator.line
                    );
                    return BrsInvalid.Instance;
                }
            case Lexeme.Not:
                if (isBrsBoolean(right)) {
                    return right.not();
                } else {
                    BrsError.make(
                        `Attempting to NOT non-boolean value.
                        value type: ${typeof right}`,
                        expression.operator.line
                    );
                    return BrsInvalid.Instance;
                }
        }

        return BrsInvalid.Instance;
    }

    visitVariable(expression: Expr.Variable) {
        return this.environment.get(expression.name);
    }

    evaluate(expression: Expr.Expression): BrsType {
        return expression.accept<BrsType>(this);
    }

    execute(statement: Stmt.Statement): Stmt.Result {
        return statement.accept<BrsType>(this);
    }
}
