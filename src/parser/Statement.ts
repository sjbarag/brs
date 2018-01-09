import * as Expr from "./Expression";
import { Token } from "../Token";

export interface Visitor<T> {
    visitExpression(statement: Expression): T;
    visitPrint(statement: Print): T;
}

export interface Statement {
    accept <R> (visitor: Visitor<R>): R;
}

export class Block implements Statement {
    constructor(readonly statements: ReadonlyArray<Statement>) {}

    accept<R>(visitor: Visitor<R>): R {
        throw new Error("Method not implemented.");
    }
}

export class Expression implements Statement {
    constructor(readonly expression: Expr.Expression) {}

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitExpression(this);
    }
}

export class Function implements Statement {
    constructor(
        readonly name: Token,
        readonly parameters: ReadonlyArray<Token>,
        readonly body: ReadonlyArray<Statement>
    ) {}

    accept<R>(visitor: Visitor<R>): R {
        throw new Error("Method not implemented.");
    }
}

export class If implements Statement {
    constructor(
        readonly condition: Expr.Expression,
        readonly thenBranch?: Statement,
        readonly elseBranch?: Statement
    ) {}

    accept<R>(visitor: Visitor<R>): R {
        throw new Error("Method not implemented.");
    }
}

export class Print implements Statement {
    constructor(
        readonly expression: Expr.Expression
    ) {}

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitPrint(this);
    }
}

export class Return implements Statement {
    constructor(
        readonly keyword: Token,
        readonly value?: Expr.Expression
    ) {}

    accept<R>(visitor: Visitor<R>): R {
        throw new Error("Method not implemented.");
    }
}

export class While implements Statement {
    constructor(
        readonly condition: Expr.Expression,
        readonly body: Statement
    ) {}

    accept<R>(visitor: Visitor<R>): R {
        throw new Error("Method not implemented.");
    }
}