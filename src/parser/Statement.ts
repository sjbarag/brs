import * as Expr from "./Expression";
import { Token, Identifier, Location, Lexeme } from "../lexer";
import { BrsType, BrsInvalid } from "../brsTypes";
import { InvalidZone } from "luxon";
import { AstNode } from "./AstNode";

/** A set of reasons why a `Block` stopped executing. */
export * from "./BlockEndReason";

export interface Visitor<T> {
    visitAssignment(statement: Assignment): BrsType;
    visitDim(statement: Dim): BrsType;
    visitExpression(statement: Expression): BrsType;
    visitExitFor(statement: ExitFor): never;
    visitExitWhile(statement: ExitWhile): never;
    visitPrint(statement: Print): BrsType;
    visitIf(statement: If): BrsType;
    visitBlock(block: Block): BrsType;
    visitFor(statement: For): BrsType;
    visitForEach(statement: ForEach): BrsType;
    visitWhile(statement: While): BrsType;
    visitNamedFunction(statement: Function): BrsType;
    visitReturn(statement: Return): never;
    visitDottedSet(statement: DottedSet): BrsType;
    visitIndexedSet(statement: IndexedSet): BrsType;
    visitIncrement(expression: Increment): BrsInvalid;
    visitLibrary(statement: Library): BrsInvalid;
}

let statementTypes = new Set<string>([
    "Assignment",
    "Expression",
    "ExitFor",
    "ExitWhile",
    "Print",
    "If",
    "Block",
    "For",
    "ForEach",
    "While",
    "Stmt_Function",
    "Return",
    "DottedSet",
    "IndexedSet",
    "Increment",
    "Library",
    "Dim",
]);

/**
 * Returns a boolean of whether or not the given object is a Statement.
 * @param obj object to check
 */
export function isStatement(obj: Expr.Expression | Statement): obj is Statement {
    return statementTypes.has(obj.type);
}

/** A BrightScript statement */
export interface Statement extends AstNode {
    /**
     * Handles the enclosing `Statement` with `visitor`.
     * @param visitor the `Visitor` that will handle the enclosing `Statement`
     * @returns a BrightScript value (typically `invalid`) and the reason why
     *          the statement exited (typically `StopReason.End`)
     */
    accept<R>(visitor: Visitor<R>): BrsType;
}

export class Assignment extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            equals: Token;
        },
        readonly name: Identifier,
        readonly value: Expr.Expression
    ) {
        super("Assignment");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitAssignment(this);
    }

    get loc() {
        return {
            file: this.name.loc.file,
            start: this.name.loc.start,
            end: this.value.loc.end,
        };
    }
}

export class Dim extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            dim: Token;
            closingBrace: Token;
        },
        readonly name: Identifier,
        readonly dimensions: Expr.Expression[]
    ) {
        super("Dim");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitDim(this);
    }

    get loc() {
        return {
            file: this.tokens.dim.loc.file,
            start: this.tokens.dim.loc.start,
            end: this.tokens.closingBrace.loc.end,
        };
    }
}

export class Block extends AstNode implements Statement {
    constructor(readonly statements: ReadonlyArray<Statement>, readonly loc: Location) {
        super("Block");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitBlock(this);
    }
}

export class Expression extends AstNode implements Statement {
    constructor(readonly expression: Expr.Expression) {
        super("Expression");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitExpression(this);
    }

    get loc() {
        return this.expression.loc;
    }
}

export class ExitFor extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            exitFor: Token;
        }
    ) {
        super("ExitFor");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitExitFor(this);
    }

    get loc() {
        return this.tokens.exitFor.loc;
    }
}

export class ExitWhile extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            exitWhile: Token;
        }
    ) {
        super("ExitWhile");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitExitWhile(this);
    }

    get loc() {
        return this.tokens.exitWhile.loc;
    }
}

export class Function extends AstNode implements Statement {
    constructor(readonly name: Identifier, readonly func: Expr.Function) {
        super("Stmt_Function");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitNamedFunction(this);
    }

    get loc() {
        return {
            file: this.name.loc.file,
            start: this.func.loc.start,
            end: this.func.loc.end,
        };
    }
}

export interface ElseIf {
    condition: Expr.Expression;
    thenBranch: Block;
    /** Signal to ESLint to walk condition and thenBranch */
    type: string;
}

export class If extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            if: Token;
            then?: Token;
            // TODO: figure a decent way to represent the if/then + elseif/then pairs to enable a
            // linter to check for the lack of `then` with this AST. maybe copy ESTree's format?
            elseIfs?: Token[];
            else?: Token;
            endIf?: Token;
        },
        readonly condition: Expr.Expression,
        readonly thenBranch: Block,
        readonly elseIfs: ElseIf[],
        readonly elseBranch?: Block
    ) {
        super("If");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitIf(this);
    }

    private getEndLocation(): Location {
        if (this.tokens.endIf) {
            return this.tokens.endIf.loc;
        } else if (this.elseBranch) {
            return this.elseBranch.loc;
        } else if (this.elseIfs.length) {
            return this.elseIfs[this.elseIfs.length - 1].thenBranch.loc;
        } else {
            return this.thenBranch.loc;
        }
    }

    get loc() {
        return {
            file: this.tokens.if.loc.file,
            start: this.tokens.if.loc.start,
            end: this.getEndLocation().end,
        };
    }
}

export class Increment extends AstNode implements Statement {
    constructor(readonly value: Expr.Expression, readonly token: Token) {
        super("Increment");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitIncrement(this);
    }

    get loc() {
        return {
            file: this.value.loc.file,
            start: this.value.loc.start,
            end: this.token.loc.end,
        };
    }
}

/** The set of all accepted `print` statement separators. */
export namespace PrintSeparator {
    /** Used to indent the current `print` position to the next 16-character-width output zone. */
    export interface Tab extends Token {
        kind: Lexeme.Comma;
    }

    /** Used to insert a single whitespace character at the current `print` position. */
    export interface Space extends Token {
        kind: Lexeme.Semicolon;
    }
}

/**
 * Represents a `print` statement within BrightScript.
 */
export class Print extends AstNode implements Statement {
    /**
     * Creates a new internal representation of a BrightScript `print` statement.
     * @param expressions an array of expressions or `PrintSeparator`s to be
     *                    evaluated and printed.
     */
    constructor(
        readonly tokens: {
            print: Token;
        },
        readonly expressions: (Expr.Expression | Token)[]
    ) {
        super("Print");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitPrint(this);
    }

    get loc() {
        let end = this.expressions.length
            ? this.expressions[this.expressions.length - 1].loc.end
            : this.tokens.print.loc.end;

        return {
            file: this.tokens.print.loc.file,
            start: this.tokens.print.loc.start,
            end: end,
        };
    }
}

export class Goto extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            goto: Token;
            label: Token;
        }
    ) {
        super("Goto");
    }

    accept<R>(_visitor: Visitor<R>): BrsType {
        //should search the code for the corresponding label, and set that as the next line to execute
        throw new Error("Not implemented");
    }

    get loc() {
        return {
            file: this.tokens.goto.loc.file,
            start: this.tokens.goto.loc.start,
            end: this.tokens.label.loc.end,
        };
    }
}

export class Label extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            identifier: Token;
            colon: Token;
        }
    ) {
        super("Label");
    }

    accept<R>(_visitor: Visitor<R>): BrsType {
        throw new Error("Not implemented");
    }

    get loc() {
        return {
            file: this.tokens.identifier.loc.file,
            start: this.tokens.identifier.loc.start,
            end: this.tokens.colon.loc.end,
        };
    }
}

export class Return extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            return: Token;
        },
        readonly value?: Expr.Expression
    ) {
        super("Return");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitReturn(this);
    }

    get loc() {
        return {
            file: this.tokens.return.loc.file,
            start: this.tokens.return.loc.start,
            end: (this.value && this.value.loc.end) || this.tokens.return.loc.end,
        };
    }
}

export class End extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            end: Token;
        }
    ) {
        super("End");
    }

    accept<R>(_visitor: Visitor<R>): BrsType {
        //TODO implement this in the runtime. It should immediately terminate program execution, without error
        throw new Error("Not implemented");
    }

    get loc() {
        return {
            file: this.tokens.end.loc.file,
            start: this.tokens.end.loc.start,
            end: this.tokens.end.loc.end,
        };
    }
}

export class Stop extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            stop: Token;
        }
    ) {
        super("Stop");
    }

    accept<R>(_visitor: Visitor<R>): BrsType {
        //TODO implement this in the runtime. It should pause code execution until a `c` command is issued from the console
        throw new Error("Not implemented");
    }

    get loc() {
        return {
            file: this.tokens.stop.loc.file,
            start: this.tokens.stop.loc.start,
            end: this.tokens.stop.loc.end,
        };
    }
}

export class For extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            for: Token;
            to: Token;
            step?: Token;
            endFor: Token;
        },
        readonly counterDeclaration: Assignment,
        readonly finalValue: Expr.Expression,
        readonly increment: Expr.Expression,
        readonly body: Block
    ) {
        super("For");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitFor(this);
    }

    get loc() {
        return {
            file: this.tokens.for.loc.file,
            start: this.tokens.for.loc.start,
            end: this.tokens.endFor.loc.end,
        };
    }
}

export class ForEach extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            forEach: Token;
            in: Token;
            endFor: Token;
        },
        readonly item: Token,
        readonly target: Expr.Expression,
        readonly body: Block
    ) {
        super("ForEach");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitForEach(this);
    }

    get loc() {
        return {
            file: this.tokens.forEach.loc.file,
            start: this.tokens.forEach.loc.start,
            end: this.tokens.endFor.loc.end,
        };
    }
}

export class While extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            while: Token;
            endWhile: Token;
        },
        readonly condition: Expr.Expression,
        readonly body: Block
    ) {
        super("While");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitWhile(this);
    }

    get loc() {
        return {
            file: this.tokens.while.loc.file,
            start: this.tokens.while.loc.start,
            end: this.tokens.endWhile.loc.end,
        };
    }
}

export class DottedSet extends AstNode implements Statement {
    constructor(
        readonly obj: Expr.Expression,
        readonly name: Identifier,
        readonly value: Expr.Expression
    ) {
        super("DottedSet");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitDottedSet(this);
    }

    get loc() {
        return {
            file: this.obj.loc.file,
            start: this.obj.loc.start,
            end: this.value.loc.end,
        };
    }
}

export class IndexedSet extends AstNode implements Statement {
    constructor(
        readonly obj: Expr.Expression,
        readonly index: Expr.Expression,
        readonly value: Expr.Expression,
        readonly closingSquare: Token
    ) {
        super("IndexedSet");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitIndexedSet(this);
    }

    get loc() {
        return {
            file: this.obj.loc.file,
            start: this.obj.loc.start,
            end: this.value.loc.end,
        };
    }
}

export class Library extends AstNode implements Statement {
    constructor(
        readonly tokens: {
            library: Token;
            filePath: Token | undefined;
        }
    ) {
        super("Library");
    }

    accept<R>(visitor: Visitor<R>): BrsType {
        return visitor.visitLibrary(this);
    }

    get loc() {
        return {
            file: this.tokens.library.loc.file,
            start: this.tokens.library.loc.start,
            end: this.tokens.filePath ? this.tokens.filePath.loc.end : this.tokens.library.loc.end,
        };
    }
}
