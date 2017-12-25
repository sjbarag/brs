import { Visitor } from "./Visitor";

export interface Expression {
    accept <R extends Expression> (visitor: Visitor<R>): R;
}