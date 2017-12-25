import { Expression } from "../Expression";
import { Visitor } from "../Visitor";

import { Token } from "../../Token";

export class Binary implements Expression {
    constructor(
        readonly left: Expression,
        readonly token: Token,
        readonly right: Expression
    ) { }


    accept <R extends Expression> (visitor: Visitor<R>): R {
        return visitor.visitBinary(this);
    }
}