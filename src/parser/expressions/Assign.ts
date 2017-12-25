import { Expression } from "../Expression";
import { Token } from "../../Token";
import { Visitor } from "../Visitor";

export class Assign implements Expression {
    constructor(
        readonly name: Token,
        readonly value: Expression
    ) {}
    
    accept <R extends Expression> (visitor: Visitor<R>): R {
        return visitor.visitAssign(this);
    }
}