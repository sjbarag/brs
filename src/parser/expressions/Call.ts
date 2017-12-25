import { Expression } from "../Expression";
import { Visitor } from "../Visitor";
import { Token } from "../../Token";

export class Call implements Expression {
    constructor(
        readonly callee: Expression,
        readonly paren: Token,
        readonly args: Expression[]
    ) {}
    
    accept <R extends Expression> (visitor: Visitor<R>): R {
        return visitor.visitCall(this);
    }
}