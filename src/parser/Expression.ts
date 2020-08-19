import { Token, Identifier, Location } from "../lexer";
import { BrsType, Argument, ValueKind, BrsString } from "../brsTypes";
import { Block, Statement } from "./Statement";
import { AstNode } from "./AstNode";

export interface Visitor<T> {
    visitBinary(expression: Binary): T;
    visitCall(expression: Call): T;
    visitAnonymousFunction(func: Function): T;
    visitDottedGet(expression: DottedGet): T;
    visitIndexedGet(expression: IndexedGet): T;
    visitGrouping(expression: Grouping): T;
    visitLiteral(expression: Literal): T;
    visitArrayLiteral(expression: ArrayLiteral): T;
    visitAALiteral(expression: AALiteral): T;
    visitUnary(expression: Unary): T;
    visitVariable(expression: Variable): T;
}

/** A BrightScript expression */
export interface Expression {
    /**
     * Handles the enclosing `Expression` with `visitor`.
     * @param visitor the `Visitor` that will handle the enclosing `Expression`
     * @returns the BrightScript value resulting from evaluating the expression
     */
    accept<R>(visitor: Visitor<R>): R;

    /** The starting and ending location of the expression. */
    location: Location;
}

export class Binary extends AstNode implements Expression {
    constructor(readonly left: Expression, readonly token: Token, readonly right: Expression) {
        super("Binary");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitBinary(this);
    }

    get location() {
        return {
            file: this.token.location.file,
            start: this.left.location.start,
            end: this.right.location.end,
        };
    }
}

export class Call extends AstNode implements Expression {
    static MaximumArguments = 32;

    constructor(
        readonly callee: Expression,
        readonly closingParen: Token,
        readonly args: Expression[]
    ) {
        super("Call");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitCall(this);
    }

    get location() {
        return {
            file: this.closingParen.location.file,
            start: this.callee.location.start,
            end: this.closingParen.location.end,
        };
    }
}

export class Function extends AstNode implements Expression {
    constructor(
        readonly parameters: ReadonlyArray<Argument>,
        readonly returns: ValueKind,
        readonly body: Block,
        readonly keyword: Token,
        readonly end: Token
    ) {
        super("Function");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitAnonymousFunction(this);
    }

    get location() {
        return {
            file: this.keyword.location.file,
            start: this.keyword.location.start,
            end: this.end.location.end,
        };
    }
}

export class DottedGet extends AstNode implements Expression {
    constructor(readonly obj: Expression, readonly name: Identifier) {
        super("DottedGet");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitDottedGet(this);
    }

    get location() {
        return {
            file: this.obj.location.file,
            start: this.obj.location.start,
            end: this.name.location.end,
        };
    }
}

export class IndexedGet extends AstNode implements Expression {
    constructor(
        readonly obj: Expression,
        readonly index: Expression,
        readonly closingSquare: Token
    ) {
        super("IndexedGet");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitIndexedGet(this);
    }

    get location() {
        return {
            file: this.obj.location.file,
            start: this.obj.location.start,
            end: this.closingSquare.location.end,
        };
    }
}

export class Grouping extends AstNode implements Expression {
    constructor(
        readonly tokens: {
            left: Token;
            right: Token;
        },
        readonly expression: Expression
    ) {
        super("Grouping");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitGrouping(this);
    }

    get location() {
        return {
            file: this.tokens.left.location.file,
            start: this.tokens.left.location.start,
            end: this.tokens.right.location.end,
        };
    }
}

export class Literal extends AstNode implements Expression {
    constructor(readonly value: BrsType, readonly _location: Location | undefined) {
        super("Literal");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitLiteral(this);
    }

    get location() {
        return (
            this._location || {
                file: "(internal)",
                start: {
                    line: -1,
                    column: -1,
                },
                end: {
                    line: -1,
                    column: -1,
                },
            }
        );
    }
}

export class ArrayLiteral extends AstNode implements Expression {
    constructor(readonly elements: Expression[], readonly open: Token, readonly close: Token) {
        super("ArrayLiteral");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitArrayLiteral(this);
    }

    get location() {
        return {
            file: this.open.location.file,
            start: this.open.location.start,
            end: this.close.location.end,
        };
    }
}

/** A member of an associative array literal. */
export interface AAMember {
    /** The name of the member. */
    name: BrsString;
    /** The expression evaluated to determine the member's initial value. */
    value: Expression;
}

export class AALiteral extends AstNode implements Expression {
    constructor(readonly elements: AAMember[], readonly open: Token, readonly close: Token) {
        super("AALiteral");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitAALiteral(this);
    }

    get location() {
        return {
            file: this.open.location.file,
            start: this.open.location.start,
            end: this.close.location.end,
        };
    }
}

export class Unary extends AstNode implements Expression {
    constructor(readonly operator: Token, readonly right: Expression) {
        super("Unary");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitUnary(this);
    }

    get location() {
        return {
            file: this.operator.location.file,
            start: this.operator.location.start,
            end: this.right.location.end,
        };
    }
}

export class Variable extends AstNode implements Expression {
    constructor(readonly name: Identifier) {
        super("Variable");
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitVariable(this);
    }

    get location() {
        return this.name.location;
    }
}
