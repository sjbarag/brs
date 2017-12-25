import { Expression } from "../Expression";
import { Visitor } from "../Visitor";
import { Literal as TokenLiteral } from "../../Token";

export class Literal implements Expression {
    constructor( readonly value: TokenLiteral) {}

    accept <R extends Expression> (visitor: Visitor<R>): R {
        return visitor.visitLiteral(this);
    }
}