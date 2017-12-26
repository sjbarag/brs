import { Visitor } from "./Visitor";
import { Token, Literal as TokenLiteral } from "../Token";

export interface Expression {
    accept <R> (visitor: Visitor<R>): R;
}

export class Assign implements Expression {
    constructor(
        readonly name: Token,
        readonly value: Expression
    ) {}

    accept <R> (visitor: Visitor<R>): R {
        return visitor.visitAssign(this);
    }
}

export class Binary implements Expression {
    constructor(
        readonly left: Expression,
        readonly token: Token,
        readonly right: Expression
    ) { }


    accept <R> (visitor: Visitor<R>): R {
        return visitor.visitBinary(this);
    }
}

export class Call implements Expression {
    constructor(
        readonly callee: Expression,
        readonly paren: Token,
        readonly args: Expression[]
    ) {}
    
    accept <R> (visitor: Visitor<R>): R {
        return visitor.visitCall(this);
    }
}

export class Get implements Expression {
    constructor(
        readonly obj: Expression,
        readonly name: Token
    ) {}

    accept <R> (visitor: Visitor<R>): R {
        return visitor.visitGet(this);
    }
}

export class Grouping implements Expression {

    constructor(
        readonly expression: Expression
    ) {}

    accept <R> (visitor: Visitor<R>): R {
        return visitor.visitGrouping(this);
    }
}

export class Literal implements Expression {
    constructor( readonly value: TokenLiteral) {}

    accept <R> (visitor: Visitor<R>): R {
        return visitor.visitLiteral(this);
    }
}

export class Logical implements Expression {
    constructor(
        readonly left: Expression,
        readonly operator: Token,
        readonly right: Expression
    ) {}

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitLogical(this);
    }
}

export class M implements Expression {
    constructor(readonly keyword: Token) {}    

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitM(this);
    }
}

export class Set implements Expression {
    constructor(
       readonly obj: Expression,
       readonly name: Token,
       readonly value: Expression
    ) {}

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitSet(this);
    }
}

export class Unary implements Expression {
    constructor(
        readonly operator: Token,
        readonly right: Expression
    ) {}

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitUnary(this);
    }
}

export class Variable implements Expression {
    constructor(
        readonly name: Token
    ) {}

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitVariable(this);
    }
}