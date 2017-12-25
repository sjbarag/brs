import { Expression } from "../Expression";
import { Visitor } from "../Visitor";
import { Token } from "../../Token";

export class Unary implements Expression {
    constructor(
        readonly operator: Token,
        readonly right: Expression
    ) {}

    accept<R extends Expression>(visitor: Visitor<R>): R {
        return visitor.visitUnary(this);
    }
}