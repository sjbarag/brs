import { Expression } from "../Expression";
import { Visitor } from "../Visitor";
import { Token } from "../../Token";

export class Variable implements Expression {
    constructor(
        readonly name: Token
    ) {}

    accept<R extends Expression>(visitor: Visitor<R>): R {
        return visitor.visitVariable(this);
    }
}