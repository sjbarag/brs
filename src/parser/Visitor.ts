import * as Expr from "./Expression";

export interface Visitor<ExpressionType extends Expr.Expression> {
    visitAssign(expression: Expr.Assign): ExpressionType;
    visitBinary(expression: Expr.Binary): ExpressionType;
    visitCall(expression: Expr.Call): ExpressionType;
    visitGet(expression: Expr.Get): ExpressionType;
    visitGrouping(expression: Expr.Grouping): ExpressionType;
    visitLiteral(expression: Expr.Literal): ExpressionType;
    visitLogical(expression: Expr.Logical): ExpressionType;
    visitM(expression: Expr.M): ExpressionType;
    visitSet(expression: Expr.Set): ExpressionType;
    visitUnary(expression: Expr.Unary): ExpressionType;
    visitVariable(expression: Expr.Variable): ExpressionType;
}