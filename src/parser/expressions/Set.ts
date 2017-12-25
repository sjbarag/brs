import { Expression } from "../Expression";
import { Visitor } from "../Visitor";
import { Token } from "../../Token";

export class Set implements Expression {
    constructor(
       readonly obj: Expression,
       readonly name: Token,
       readonly value: Expression
    ) {}

    accept<R extends Expression>(visitor: Visitor<R>): R {
        return visitor.visitSet(this);
    }
}