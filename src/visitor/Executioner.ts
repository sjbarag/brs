import Long = require("long");

import * as Expr from "../parser/Expression";
import * as Stmt from "../parser/Statement";
import { Literal as TokenLiteral } from "../Token";
import { Lexeme } from "../Lexeme";
import { stringify } from "../Stringify";
import * as BrsError from "../Error";

export function isLong(arg: TokenLiteral): arg is Long {
    return Long.isLong(arg);
}

function isNumber(arg: TokenLiteral): arg is number {
    return typeof arg === "number";
}

function isString(arg: TokenLiteral): arg is string {
    return typeof arg === "string";
}

export class Executioner implements Expr.Visitor<TokenLiteral>, Stmt.Visitor<TokenLiteral> {
    exec(statements: Stmt.Statement[]) {
        return statements.map((statement) => this.execute(statement));
    }

    visitExpression(statement: Stmt.Expression): TokenLiteral {
        return this.evaluate(statement.expression);
    }

    visitPrint(statement: Stmt.Print): TokenLiteral {
        let result = this.evaluate(statement.expression);
        console.log(stringify(result));
        return;
    }

    visitAssign(expression: Expr.Assign) {
        return undefined;
    }

    visitBinary(expression: Expr.Binary) {
        let lexeme = expression.token.kind;
        let left = this.evaluate(expression.left);
        let right: TokenLiteral;

        if (lexeme !== Lexeme.And && lexeme !== Lexeme.Or) {
            // don't evaluate right-hand-side of boolean expressions, to preserve short-circuiting
            // behavior found in other languages. e.g. `foo() && bar()` won't execute `bar()` if
            // `foo()` returns `false`.
            right = this.evaluate(expression.right);
        }

        switch (lexeme) {
            case Lexeme.Minus:
                if (isLong(left) && isLong(right)) {
                    return left.subtract(right);
                } else if (isNumber(left) && isNumber(right)) {
                    return left - right;
                } else {
                    BrsError.make(
                        `Attempting to subtract non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.Star:
                if (isLong(left) && isLong(right)) {
                    return left.multiply(right);
                } else if (isNumber(left) && isNumber(right)) {
                    return left * right;
                } else {
                    BrsError.make(
                        `Attempting to multiply non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.Caret:
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    // TODO: Figure out how to exponentiate Longs
                    return;
                } else if (isNumber(left) && isNumber(right)) {
                    // TODO: See if we can use a Long as an exponent
                    return Math.pow(left, right);
                } else {
                    BrsError.make(
                        `Attempting to exponentiate non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.Slash:
                if (isLong(left) && isLong(right)) {
                    return left.divide(right);
                } else if (isNumber(left) && isNumber(right)) {
                    // TODO: Figure out how to handle type promotion
                    // https://sdkdocs.roku.com/display/sdkdoc/Expressions%2C+Variables%2C+and+Types#Expressions,Variables,andTypes-TypeConversion(Promotion)
                    return left / right;
                } else {
                    BrsError.make(
                        `Attempting to divide non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.Mod:
                if (isLong(left) && isLong(right)) {
                    return left.modulo(right)
                } else if (isNumber(left) && isNumber(right)) {
                    return left % right;
                } else {
                    BrsError.make(
                        `Attempting to modulo non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.Backslash:
                if (isLong(left) && isLong(right)) {
                    // TODO: Figure out if this is actually safe for integer division
                    return left.divide(right).toInt();
                } else if (isNumber(left) && isNumber(right)) {
                    return Math.floor(left / right);
                } else {
                    BrsError.make(
                        `Attempting to integer-divide non-numeric objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.Plus:
                if (isLong(left) && isLong(right)) {
                    return left.add(right);
                } else if (isNumber(left) && isNumber(right)) {
                    return left + right;
                } else if (isString(left) && isString(right)) {
                    return left + right;
                } else {
                    BrsError.make(
                        `Attempting to add non-homogeneous objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.Greater:
                if (isLong(left) && isLong(right)) {
                    return left.greaterThan(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left > right;
                } else {
                    BrsError.make(
                        `Attempting to compare unexpected objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.GreaterEqual:
                if (isLong(left) && isLong(right)) {
                    return left.greaterThanOrEqual(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left >= right;
                } else {
                    BrsError.make(
                        `Attempting to compare unexpected objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.Less:
                if (isLong(left) && isLong(right)) {
                    return left.lessThan(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left < right;
                } else {
                    BrsError.make(
                        `Attempting to compare unexpected objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.LessEqual:
                if (isLong(left) && isLong(right)) {
                    return left.lessThanOrEqual(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left <= right;
                } else {
                    BrsError.make(
                        `Attempting to compare unexpected objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.Equal:
                if (isLong(left) && isLong(right)) {
                    return left.equals(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left === right;
                } else {
                    BrsError.make(
                        `Attempting to compare unexpected objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.LessGreater:
                if (isLong(left) && isLong(right)) {
                    return left.notEquals(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left !== right;
                } else {
                    BrsError.make(
                        `Attempting to compare unexpected objects.
                        left: ${typeof left}
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.And:
                if (left === false) {
                    // short-circuit ANDs - don't evaluate RHS if LHS is false
                    return false;
                } else if (left === true) {
                    right = this.evaluate(expression.right);
                    if (typeof right === "boolean") {
                        return left && right;
                    }

                    BrsError.make(
                        `Attempting to 'and' boolean with non-boolean expression
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                } else if (isNumber(left) || isLong(left)) {
                    right = this.evaluate(expression.right);
                    if (isNumber(left) && isNumber(right)) {
                        return left & right;
                    }

                    if (isLong(left) && isLong(right)) {
                        return left.and(right);
                    }

                    // TODO: figure out how to handle 32-bit int AND 64-bit int
                    BrsError.make(
                        `Attempting to bitwise 'and' number with non-numeric expression
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                } else {
                    BrsError.make(
                        `Attempting to 'and' unexpected expressions
                        left: ${typeof left},
                        right: ${typeof this.evaluate(expression.right)}`,
                        expression.token.line
                    );
                    return;
                }
            case Lexeme.Or:
                if (left === true) {
                    // short-circuit ORs - don't evaluate RHS if LHS is true
                    return true;
                } else if (left === false) {
                    right = this.evaluate(expression.right);
                    if (typeof right === "boolean") {
                        return left || right;
                    } else {
                        BrsError.make(
                            `Attempting to 'or' boolean with non-boolean expression
                            right: ${typeof right}`,
                            expression.token.line
                        );
                        return;
                    }
                } else if (isNumber(left) || isLong(left)) {
                    right = this.evaluate(expression.right);
                    if (isNumber(left) && isNumber(right)) {
                        // numbers use bitwise OR
                        return left | right;
                    }

                    if (isLong(left) && isLong(right)) {
                        return left.or(right);
                    }

                    // TODO: figure out how to handle 32-bit int OR 64-bit int
                    BrsError.make(
                        `Attempting to bitwise 'or' number with non-numeric expression
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                } else {
                    BrsError.make(
                        `Attempting to 'or' unexpected objects
                        left: ${typeof left},
                        right: ${typeof right}`,
                        expression.token.line
                    );
                    return;
                }
            default:
                BrsError.make(
                    `Received unexpected token kind '${expression.token.kind}'`,
                    expression.token.line
                );
                return;
        }
    }
    visitCall(expression: Expr.Call) {
        return undefined;
    }
    visitGet(expression: Expr.Get) {
        return undefined;
    }

    visitGrouping(expr: Expr.Grouping) {
        return this.evaluate(expr.expression);
    }

    visitLiteral(expression: Expr.Literal): TokenLiteral {
        if (expression.value === undefined) {
            return "invalid";
        } else {
            return expression.value;
        }
    }
    visitLogical(expression: Expr.Logical) {
        return undefined;
    }
    visitM(expression: Expr.M) {
        return undefined;
    }
    visitSet(expression: Expr.Set) {
        return undefined;
    }

    visitUnary(expression: Expr.Unary) {
        let right = this.evaluate(expression.right);

        switch (expression.operator.kind) {
            case Lexeme.Minus:
                if (isLong(right) || isNumber(right)) {
                    return -(right!);
                } else {
                    BrsError.make(
                        `Attempting to negate non-numeric value.
                        value type: ${typeof right}`,
                        expression.operator.line
                    );
                    return;
                }
            case Lexeme.Not:
                // TODO: protect against inverting numbers or strings
                return !right;
        }

        return undefined;
    }

    visitVariable(expression: Expr.Variable) {
        return undefined;
    }

    evaluate(expression: Expr.Expression): TokenLiteral {
        return expression.accept<TokenLiteral>(this);
    }

    execute(statement: Stmt.Statement): TokenLiteral {
        return statement.accept<TokenLiteral>(this);
    }
}