import Long = require("long");

import { BrsType, ValueKind, BrsInvalid, isNumeric } from "../brsTypes";
import * as Expr from "../parser/Expression";
import * as Stmt from "../parser/Statement";
import { Lexeme } from "../Lexeme";
import { stringify } from "../Stringify";
import * as BrsError from "../Error";

import Environment from "./Environment";

export class Executioner implements Expr.Visitor<BrsType>, Stmt.Visitor<BrsType> {
    private environment = new Environment();

    exec(statements: Stmt.Statement[]) {
        return statements.map((statement) => this.execute(statement));
    }

    visitAssign(statement: Expr.Assign): BrsType {
        return BrsInvalid.Instance;
    }

    visitExpression(statement: Stmt.Expression): BrsType {
        return this.evaluate(statement.expression);
    }

    visitPrint(statement: Stmt.Print): BrsType {
        let result = this.evaluate(statement.expression);
        console.log(stringify(result));
        return BrsInvalid.Instance;
    }

    visitAssignment(statement: Stmt.Assignment): BrsInvalid {
        let value = this.evaluate(statement.value);
        this.environment.define(statement.name.text!, value);
        return BrsInvalid.Instance;
    }

    visitBinary(expression: Expr.Binary) {
        let lexeme = expression.token.kind;
        let left = this.evaluate(expression.left);
        let right: BrsType;

        if (lexeme !== Lexeme.And && lexeme !== Lexeme.Or) {
            // don't evaluate right-hand-side of boolean expressions, to preserve short-circuiting
            // behavior found in other languages. e.g. `foo() && bar()` won't execute `bar()` if
            // `foo()` returns `false`.
            right = this.evaluate(expression.right);
        }

        switch (lexeme) {
            case Lexeme.Minus:
                if (isNumeric(left) && isNumeric(right)) {
                    return left.subtract(right);
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
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    return left.multiply(right);
                } else if (isNumber(left) && isLong(right)) {
                    return Long.fromNumber(left).multiply(right);
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
                } else if (isNumber(left) && isLong(right)) {
                    // TODO: See if we can use a Long as an exponent
                    return;
                } else if (isNumber(left) && isNumber(right)) {
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
                if (isLong(left)) {
                    if (isLong(right)) {
                        return left.toNumber() / right.toNumber();;
                    } else if (isNumber(right)) {
                        return left.toNumber() / right;
                    }
                } else if (isNumber(left)) {
                    if (isLong(right)) {
                        return left / right.toNumber();
                    } else if (isNumber(right)) {
                        return left / right;
                    }
                }
                BrsError.make(
                    `Attempting to divide non-numeric objects.
                    left: ${typeof left}
                    right: ${typeof right}`,
                    expression.token.line
                );
                return;
            case Lexeme.Mod:
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    return left.modulo(right)
                } else if (isNumber(left) && isLong(right)) {
                    return Long.fromNumber(left).modulo(right);
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
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    return left.divide(right);
                } else if (isNumber(left) && isLong(right)) {
                    return Math.floor(left / right.toNumber());
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
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    return left.add(right);
                } else if (isNumber(left) && isLong(right)) {
                    return Long.fromNumber(left).add(right);
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
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    return left.greaterThan(right);
                } else if (isNumber(left) && isLong(right)) {
                    return Long.fromNumber(left).greaterThan(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left > right;
                } else {
                    return false;
                }
            case Lexeme.GreaterEqual:
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    return left.greaterThanOrEqual(right);
                } else if (isNumber(left) && isLong(right)) {
                    return Long.fromNumber(left).greaterThanOrEqual(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left >= right;
                } else {
                    return false;
                }
            case Lexeme.Less:
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    return left.lessThan(right);
                } else if (isNumber(left) && isLong(right)) {
                    return Long.fromNumber(left).lessThan(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left < right;
                } else {
                    return false;
                }
            case Lexeme.LessEqual:
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    return left.lessThanOrEqual(right);
                } else if (isNumber(left) && isLong(right)) {
                    return Long.fromNumber(left).lessThanOrEqual(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left <= right;
                } else {
                    return false;
                }
            case Lexeme.Equal:
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    return left.equals(right);
                } else if (isNumber(left) && isLong(right)) {
                    return Long.fromNumber(left).equals(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left === right;
                } else {
                    return false;
                }
            case Lexeme.LessGreater:
                if (isLong(left) && (isLong(right) || isNumber(right))) {
                    return left.notEquals(right);
                } else if (isNumber(left) && isLong(right)) {
                    return Long.fromNumber(left).notEquals(right);
                } else if ((isNumber(left) && isNumber(right)) || isString(left) && isString(right)) {
                    return left !== right;
                } else {
                    return true;
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
                    if (isNumber(left)) {
                        if (isNumber(right)) {
                            return left & right;
                        } else if (isLong(right)) {
                            return Long.fromNumber(left).and(right);
                        }
                    }

                    if (isLong(left) && (isLong(right) || isNumber(right))) {
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
                    // numbers use bitwise OR
                    if (isNumber(left)) {
                        if (isNumber(right)) {
                            return left | right;
                        } else if (isLong(right)) {
                            return Long.fromNumber(left).or(right);
                        }
                    }

                    if (isLong(left) && (isLong(right) || isNumber(right))) {
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

    visitLiteral(expression: Expr.Literal): BrsType {
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
        return this.environment.get(expression.name);
    }

    evaluate(expression: Expr.Expression): BrsType {
        return expression.accept<BrsType>(this);
    }

    execute(statement: Stmt.Statement): BrsType {
        return statement.accept<BrsType>(this);
    }
}