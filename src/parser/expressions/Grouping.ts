import { Expression } from "../Expression";
import { Visitor } from "../Visitor";

export class Grouping implements Expression {

    constructor(
        readonly expression: Expression
    ) {}

    accept <R extends Expression> (visitor: Visitor<R>): R {
        return visitor.visitGrouping(this);
    }
}