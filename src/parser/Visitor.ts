import * as Expr from "./Expression";

export interface Visitor<T> {
    visitAssign(expression: Expr.Assign): T;
    visitBinary(expression: Expr.Binary): T;
    visitCall(expression: Expr.Call): T;
    visitGet(expression: Expr.Get): T;
    visitGrouping(expression: Expr.Grouping): T;
    visitLiteral(expression: Expr.Literal): T;
    visitLogical(expression: Expr.Logical): T;
    visitM(expression: Expr.M): T;
    visitSet(expression: Expr.Set): T;
    visitUnary(expression: Expr.Unary): T;
    visitVariable(expression: Expr.Variable): T;
}