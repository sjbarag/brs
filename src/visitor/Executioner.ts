import Int64 = require("node-int64");

import * as Expr from "../parser/Expression";
import { Visitor } from "./";
import { Literal as TokenLiteral } from "../Token";
import { Lexeme } from "../Lexeme";

class Executioner implements Visitor<TokenLiteral> {
    visitAssign(expression: Expr.Assign) {
        return undefined;
    }
    visitBinary(expression: Expr.Binary) {
        let left = this.evaluate(expression.left);
        let right = this.evaluate(expression.right);

        switch (expression.token.kind) {
            case Lexeme.Minus:
                if (left instanceof Int64 && right instanceof Int64) {
                    return
                }
                return left - right;
        }
    }
    visitCall(expression: Expr.Call) {
        return undefined;
    }
    visitGet(expression: Expr.Get) {
        return undefined;
    }

    visitGrouping(expression: Expr.Grouping) {
        return this.evaluate(expression);
    }

    visitLiteral(expression: Expr.Literal): TokenLiteral {
        return expression.value;
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
                return -right;
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