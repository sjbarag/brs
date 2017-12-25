import { Expression } from "../Expression";

import { Token } from "../../Token";
import { Visitor } from "../Visitor";

export class Logical implements Expression {
    constructor(
        readonly left: Expression,
        readonly operator: Token,
        readonly right: Expression
    ) {}

    accept<R extends Expression>(visitor: Visitor<R>): R {
        return visitor.visitLogical(this);
    }
}