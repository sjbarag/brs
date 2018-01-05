import Long = require("long");

import * as Expr from "../parser/Expression";
import { Visitor } from "./";
import { Literal as TokenLiteral } from "../Token";
import { Lexeme } from "../Lexeme";
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

export class Executioner implements Visitor<TokenLiteral> {
    exec(expression: Expr.Expression) {
        return this.evaluate(expression);
    }

    visitAssign(expression: Expr.Assign) {
        return undefined;
    }
    visitBinary(expression: Expr.Binary) {
        let left = this.evaluate(expression.left);
        let right = this.evaluate(expression.right);

        switch (expression.token.kind) {
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
                }
                return;
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
                // TODO: protect against negating strings or booleans
                return -(right!);
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
}