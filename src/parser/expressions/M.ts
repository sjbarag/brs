import { Expression } from "../Expression";
import { Visitor } from "../Visitor";
import { Token } from "../../Token";

export class M implements Expression {
    constructor(readonly keyword: Token) {}    

    accept<R extends Expression>(visitor: Visitor<R>): R {
        return visitor.visitM(this);
    }
}