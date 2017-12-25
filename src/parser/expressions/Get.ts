import { Expression } from "../Expression";
import { Token } from "../../Token";
import { Visitor } from "../Visitor";

export class Get implements Expression {
    constructor(
        readonly obj: Expression,
        readonly name: Token
    ) {}

    accept <R extends Expression> (visitor: Visitor<R>): R {
        return visitor.visitGet(this);
    }
}
