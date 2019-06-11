import { EventEmitter } from "events";

import * as Expr from "./Expression";
type Expression = Expr.Expression;
import * as Stmt from "./Statement";
type Statement = Stmt.Statement;
import { Lexeme, Token, Identifier, Location, ReservedWords } from "../lexer";
import { ParseError } from "./ParseError";

import {
    BrsInvalid,
    BrsBoolean,
    BrsString,
    Int32,
    ValueKind,
    Argument,
    StdlibArgument,
} from "../brsTypes";

/** Set of all keywords that end blocks. */
type BlockTerminator =
    | Lexeme.ElseIf
    | Lexeme.Else
    | Lexeme.EndFor
    | Lexeme.Next
    | Lexeme.EndIf
    | Lexeme.EndWhile
    | Lexeme.EndSub
    | Lexeme.EndFunction;

/** The set of operators valid for use in assignment statements. */
const assignmentOperators = [
    Lexeme.Equal,
    Lexeme.MinusEqual,
    Lexeme.PlusEqual,
    Lexeme.StarEqual,
    Lexeme.SlashEqual,
    Lexeme.BackslashEqual,
    Lexeme.LeftShiftEqual,
    Lexeme.RightShiftEqual,
];

/** List of Lexemes that are permitted as property names. */
const allowedProperties = [
    Lexeme.And,
    Lexeme.Box,
    Lexeme.CreateObject,
    Lexeme.Dim,
    Lexeme.Else,
    Lexeme.ElseIf,
    Lexeme.End,
    Lexeme.EndFunction,
    Lexeme.EndFor,
    Lexeme.EndIf,
    Lexeme.EndSub,
    Lexeme.EndWhile,
    Lexeme.Eval,
    Lexeme.Exit,
    Lexeme.ExitFor,
    Lexeme.ExitWhile,
    Lexeme.False,
    Lexeme.For,
    Lexeme.ForEach,
    Lexeme.Function,
    Lexeme.GetGlobalAA,
    Lexeme.GetLastRunCompileError,
    Lexeme.GetLastRunRunTimeError,
    Lexeme.Goto,
    Lexeme.If,
    Lexeme.Invalid,
    Lexeme.Let,
    Lexeme.Next,
    Lexeme.Not,
    Lexeme.ObjFun,
    Lexeme.Or,
    Lexeme.Pos,
    Lexeme.Print,
    Lexeme.Rem,
    Lexeme.Return,
    Lexeme.Step,
    Lexeme.Stop,
    Lexeme.Sub,
    Lexeme.Tab,
    Lexeme.To,
    Lexeme.True,
    Lexeme.Type,
    Lexeme.While,
];

/** List of Lexeme that are allowed as local var identifiers. */
const allowedIdentifiers = [Lexeme.EndFor, Lexeme.ExitFor, Lexeme.ForEach];

/**
 * List of string versions of Lexeme that are NOT allowed as local var identifiers.
 * Used to throw more helpful "you can't use a reserved word as an identifier" errors.
 */
const disallowedIdentifiers = new Set(
    [
        Lexeme.And,
        Lexeme.Box,
        Lexeme.CreateObject,
        Lexeme.Dim,
        Lexeme.Else,
        Lexeme.ElseIf,
        Lexeme.End,
        Lexeme.EndFunction,
        Lexeme.EndIf,
        Lexeme.EndSub,
        Lexeme.EndWhile,
        Lexeme.Eval,
        Lexeme.Exit,
        Lexeme.ExitWhile,
        Lexeme.False,
        Lexeme.For,
        Lexeme.Function,
        Lexeme.GetGlobalAA,
        Lexeme.GetLastRunCompileError,
        Lexeme.GetLastRunRunTimeError,
        Lexeme.Goto,
        Lexeme.If,
        Lexeme.Invalid,
        Lexeme.Let,
        Lexeme.Next,
        Lexeme.Not,
        Lexeme.ObjFun,
        Lexeme.Or,
        Lexeme.Pos,
        Lexeme.Print,
        Lexeme.Rem,
        Lexeme.Return,
        Lexeme.Step,
        Lexeme.Sub,
        Lexeme.Tab,
        Lexeme.To,
        Lexeme.True,
        Lexeme.Type,
        Lexeme.While,
    ].map(x => Lexeme[x].toLowerCase())
);

/** The results of a Parser's parsing pass. */
interface ParseResults {
    /** The statements produced by the parser. */
    statements: Stmt.Statement[];
    /** The errors encountered by the Parser. */
    errors: ParseError[];
}

/**
 * Parses an array of tokens into an abstract syntax tree. This is a one-time-use class.
 * You should instantiate a new instance of this class for every BrightScript file you want to parse.
 */
export class Parser {
    /** Allows consumers to observe errors as they're detected. */
    public readonly events = new EventEmitter();

    /**
     * A convenience function, equivalent to `new Parser().parse(toParse)`, that parses an array of
     * `Token`s into an abstract syntax tree that can be executed with the `Interpreter`.
     * @param toParse the array of tokens to parse
     * @returns an array of `Statement` objects that together form the abstract syntax tree of the
     *          program
     */
    public static parse(toParse: ReadonlyArray<Token>) {
        return new Parser().parse(toParse);
    }

    /**
     * Convenience function to subscribe to the `err` events emitted by `parser.events`.
     * @param errorHandler the function to call for every Parser error emitted after subscribing
     * @returns an object with a `dispose` function, used to unsubscribe from errors
     */
    public onError(errorHandler: (err: ParseError) => void) {
        this.events.on("err", errorHandler);
        return {
            dispose: () => {
                this.events.removeListener("err", errorHandler);
            },
        };
    }

    /**
     * Convenience function to subscribe to a single `err` event emitted by `parser.events`.
     * @param errorHandler the function to call for the first Parser error emitted after subscribing
     */
    public onErrorOnce(errorHandler: (err: ParseError) => void) {
        this.events.once("err", errorHandler);
    }

    /**
     * The current token index. This gets reset on every parse
     */
    private current = 0;

    /**
     * The list of tokens this parser should parse
     */
    private tokens = [] as ReadonlyArray<Token>;

    /**
     * The depth of the calls to function declarations. Helps some checks know if they are at the root or not.
     */
    private functionDeclarationLevel = 0;

    /**
     * List of statements generated by the parser. This is your abstract syntax tree.
     */
    private statements = [] as Statement[];

    /**
     * List of errors found when parsing the tokens.
     */
    private errors = [] as ParseError[];

    /**
     * Determines if the current state of the parser is at the root level of the program (i.e. NOT inside of a function block)
     */
    private isAtRootLevel() {
        return this.functionDeclarationLevel === 0;
    }

    /**
     * Add an error to the parse results.
     * @param token - the token where the error occurred
     * @param message - the message for this error
     * @returns an error object that can be thrown if the calling code needs to abort parsing
     */
    private addError(token: Token, message: string) {
        let err = new ParseError(token, message);
        this.errors.push(err);
        this.events.emit("err", err);
        return err;
    }

    /**
     * Add an error at the given location.
     * @param location
     * @param message
     */
    private addErrorAtLocation(location: Location, message: string) {
        this.addError({ location: location } as any, message);
    }

    /**
     * Parses an array of `Token`s into an abstract syntax tree that can be executed with the `Interpreter`.
     * @param toParse the array of tokens to parse
     * @returns an array of `Statement` objects that together form the abstract syntax tree of the
     *          program
     */
    public parse(toParse: ReadonlyArray<Token>): ParseResults {
        this.tokens = toParse;
        this.current = 0;
        this.functionDeclarationLevel = 0;

        if (this.tokens.length === 0) {
            return {
                statements: [],
                errors: [],
            };
        }

        try {
            while (!this.isAtEnd()) {
                let dec = this.declaration();
                if (dec) {
                    this.statements.push(dec);
                }
            }

            return {
                statements: this.statements,
                errors: this.errors,
            };
        } catch (parseError) {
            return {
                statements: [],
                errors: this.errors,
            };
        }
    }
    /**
     * A simple wrapper around `check` to make tests for a `end` identifier.
     * `end` is a keyword, but not reserved, so associative arrays can have properties
     * called `end`; the parser takes on this task.
     * @returns `true` if the next token is an identifier with text `end`, otherwise `false`
     */
    private checkEnd() {
        return this.check(Lexeme.Identifier) && this.peek().text.toLowerCase() === "end";
    }

    private declaration(...additionalTerminators: BlockTerminator[]): Statement | undefined {
        try {
            // consume any leading newlines
            while (this.match(Lexeme.Newline));

            if (this.check(Lexeme.Sub, Lexeme.Function)) {
                return this.functionDeclaration(false);
            }

            if (this.checkLibrary()) {
                return this.libraryStatement();
            }

            // BrightScript is like python, in that variables can be declared without a `var`,
            // `let`, (...) keyword. As such, we must check the token *after* an identifier to figure
            // out what to do with it.
            if (
                this.check(Lexeme.Identifier, ...allowedIdentifiers) &&
                this.checkNext(...assignmentOperators)
            ) {
                return this.assignment(...additionalTerminators);
            }

            return this.statement(...additionalTerminators);
        } catch (error) {
            this.synchronize();
            return;
        }
    }

    private functionDeclaration(isAnonymous: true): Expr.Function;
    private functionDeclaration(isAnonymous: false): Stmt.Function;
    private functionDeclaration(isAnonymous: boolean) {
        try {
            //certain statements need to know if they are contained within a function body
            //so track the depth here
            this.functionDeclarationLevel++;
            let startingKeyword = this.peek();
            let isSub = this.check(Lexeme.Sub);
            let functionType = this.advance();
            let name: Identifier;
            let returnType: ValueKind;
            let leftParen: Token;
            let rightParen: Token;

            if (isSub) {
                returnType = ValueKind.Void;
            } else {
                returnType = ValueKind.Dynamic;
            }

            if (isAnonymous) {
                leftParen = this.consume(
                    `Expected '(' after ${functionType.text}`,
                    Lexeme.LeftParen
                );
            } else {
                name = this.consume(
                    `Expected ${functionType.text} name after '${functionType.text}'`,
                    Lexeme.Identifier
                ) as Identifier;
                leftParen = this.consume(
                    `Expected '(' after ${functionType.text} name`,
                    Lexeme.LeftParen
                );

                //prevent functions from ending with type designators
                let lastChar = name.text[name.text.length - 1];
                if (["$", "%", "!", "#", "&"].includes(lastChar)) {
                    //don't throw this error; let the parser continue
                    this.addError(
                        name,
                        `Function name '${name.text}' cannot end with type designator '${lastChar}'`
                    );
                }
            }

            let args: Argument[] = [];
            if (!this.check(Lexeme.RightParen)) {
                do {
                    if (args.length >= Expr.Call.MaximumArguments) {
                        throw this.addError(
                            this.peek(),
                            `Cannot have more than ${Expr.Call.MaximumArguments} arguments`
                        );
                    }

                    args.push(this.signatureArgument());
                } while (this.match(Lexeme.Comma));
            }
            rightParen = this.advance();

            let maybeAs = this.peek();
            if (this.check(Lexeme.Identifier) && maybeAs.text.toLowerCase() === "as") {
                this.advance();

                let typeToken = this.advance();
                let typeString = typeToken.text || "";
                let maybeReturnType = ValueKind.fromString(typeString);

                if (!maybeReturnType) {
                    throw this.addError(
                        typeToken,
                        `Function return type '${typeString}' is invalid`
                    );
                }

                returnType = maybeReturnType;
            }

            args.reduce((haveFoundOptional: boolean, arg: Argument) => {
                if (haveFoundOptional && !arg.defaultValue) {
                    throw this.addError(
                        {
                            kind: Lexeme.Identifier,
                            text: arg.name.text,
                            isReserved: ReservedWords.has(arg.name.text),
                            location: arg.location,
                        },
                        `Argument '${
                            arg.name.text
                        }' has no default value, but comes after arguments with default values`
                    );
                }

                return haveFoundOptional || !!arg.defaultValue;
            }, false);

            this.consume(
                `Expected newline or ':' after ${functionType.text} signature`,
                Lexeme.Newline,
                Lexeme.Colon
            );
            //support ending the function with `end sub` OR `end function`
            let body = this.block(Lexeme.EndSub, Lexeme.EndFunction);
            if (!body) {
                throw this.addError(
                    this.peek(),
                    `Expected 'end ${functionType.text}' to terminate ${functionType.text} block`
                );
            }
            // consume 'end sub' or 'end function'
            let endingKeyword = this.advance();
            let expectedEndKind = isSub ? Lexeme.EndSub : Lexeme.EndFunction;

            //if `function` is ended with `end sub`, or `sub` is ended with `end function`, then
            //add an error but don't hard-fail so the AST can continue more gracefully
            if (endingKeyword.kind !== expectedEndKind) {
                this.addError(
                    endingKeyword,
                    `Expected 'end ${functionType.text}' to terminate ${functionType.text} block`
                );
            }

            let func = new Expr.Function(args, returnType, body, startingKeyword, endingKeyword);

            if (isAnonymous) {
                return func;
            } else {
                // only consume trailing newlines in the statement context; expressions
                // expect to handle their own trailing whitespace
                while (this.match(Lexeme.Newline));
                return new Stmt.Function(name!, func);
            }
        } finally {
            this.functionDeclarationLevel--;
        }
    }

    private signatureArgument(): Argument {
        if (!this.check(Lexeme.Identifier)) {
            throw this.addError(
                this.peek(),
                `Expected argument name, but received '${this.peek().text || ""}'`
            );
        }

        let name = this.advance();
        let type: ValueKind = ValueKind.Dynamic;
        let typeToken: Token | undefined;
        let defaultValue;

        // parse argument default value
        if (this.match(Lexeme.Equal)) {
            // it seems any expression is allowed here -- including ones that operate on other arguments!
            defaultValue = this.expression();
        }

        let next = this.peek();
        if (this.check(Lexeme.Identifier) && next.text && next.text.toLowerCase() === "as") {
            // 'as' isn't a reserved word, so it can't be lexed into an As token without the lexer
            // understanding language context.  That's less than ideal, so we'll have to do some
            // more intelligent comparisons to detect the 'as' sometimes-keyword here.
            this.advance();

            typeToken = this.advance();
            let typeValueKind = ValueKind.fromString(typeToken.text);

            if (!typeValueKind) {
                throw this.addError(
                    typeToken,
                    `Function parameter '${name.text}' is of invalid type '${typeToken.text}'`
                );
            }

            type = typeValueKind;
        }

        return {
            name: name,
            type: {
                kind: type,
                location: typeToken ? typeToken.location : StdlibArgument.InternalLocation,
            },
            defaultValue: defaultValue,
            location: {
                file: name.location.file,
                start: name.location.start,
                end: typeToken ? typeToken.location.end : name.location.end,
            },
        };
    }

    private assignment(...additionalterminators: Lexeme[]): Stmt.Assignment {
        let name = this.advance() as Identifier;
        //add error if name is a reserved word that cannot be used as an identifier
        if (disallowedIdentifiers.has(name.text.toLowerCase())) {
            //don't throw...this is fully recoverable
            this.addError(name, `Cannot use reserved word "${name.text}" as an identifier`);
        }
        let operator = this.consume(
            `Expected operator ('=', '+=', '-=', '*=', '/=', '\\=', '^=', '<<=', or '>>=') after idenfifier '${
                name.text
            }'`,
            ...assignmentOperators
        );

        let value = this.expression();
        if (!this.check(...additionalterminators)) {
            this.consume(
                "Expected newline or ':' after assignment",
                Lexeme.Newline,
                Lexeme.Colon,
                Lexeme.Eof,
                ...additionalterminators
            );
        }

        if (operator.kind === Lexeme.Equal) {
            return new Stmt.Assignment({ equals: operator }, name, value);
        } else {
            return new Stmt.Assignment(
                { equals: operator },
                name,
                new Expr.Binary(new Expr.Variable(name), operator, value)
            );
        }
    }

    private checkLibrary() {
        let isLibraryIdentifier =
            this.check(Lexeme.Identifier) && this.peek().text.toLowerCase() === "library";
        //if we are at the top level, any line that starts with "library" should be considered a library statement
        if (this.isAtRootLevel() && isLibraryIdentifier) {
            return true;
        }
        //not at root level, library statements are all invalid here, but try to detect if the tokens look
        //like a library statement (and let the libraryStatement function handle emitting the errors)
        else if (isLibraryIdentifier && this.checkNext(Lexeme.String)) {
            return true;
        }
        //definitely not a library statement
        else {
            return false;
        }
    }

    private statement(...additionalterminators: BlockTerminator[]): Statement | undefined {
        if (this.checkLibrary()) {
            return this.libraryStatement();
        }

        if (this.check(Lexeme.Stop)) {
            return this.stopStatement();
        }

        if (this.check(Lexeme.If)) {
            return this.ifStatement();
        }

        if (this.check(Lexeme.Print)) {
            return this.printStatement(...additionalterminators);
        }

        if (this.check(Lexeme.While)) {
            return this.whileStatement();
        }

        if (this.check(Lexeme.ExitWhile)) {
            return this.exitWhile();
        }

        if (this.check(Lexeme.For)) {
            return this.forStatement();
        }

        if (this.check(Lexeme.ForEach)) {
            return this.forEachStatement();
        }

        if (this.check(Lexeme.ExitFor)) {
            return this.exitFor();
        }

        if (this.checkEnd()) {
            return this.endStatement();
        }

        if (this.match(Lexeme.Return)) {
            return this.returnStatement();
        }

        // TODO: support multi-statements
        return this.setStatement(...additionalterminators);
    }

    private whileStatement(): Stmt.While {
        const whileKeyword = this.advance();
        const condition = this.expression();

        this.consume("Expected newline after 'while ...condition...'", Lexeme.Newline);
        const whileBlock = this.block(Lexeme.EndWhile);
        if (!whileBlock) {
            throw this.addError(this.peek(), "Expected 'end while' to terminate while-loop block");
        }
        const endWhile = this.advance();
        while (this.match(Lexeme.Newline));

        return new Stmt.While({ while: whileKeyword, endWhile: endWhile }, condition, whileBlock);
    }

    private exitWhile(): Stmt.ExitWhile {
        let keyword = this.advance();
        this.consume("Expected newline after 'exit while'", Lexeme.Newline);
        while (this.match(Lexeme.Newline)) {}
        return new Stmt.ExitWhile({ exitWhile: keyword });
    }

    private forStatement(): Stmt.For {
        const forKeyword = this.advance();
        const initializer = this.assignment(Lexeme.To);
        const to = this.advance();
        const finalValue = this.expression();
        let increment: Expression | undefined;
        let step: Token | undefined;

        if (this.check(Lexeme.Step)) {
            step = this.advance();
            increment = this.expression();
        } else {
            // BrightScript for/to/step loops default to a step of 1 if no `step` is provided
            increment = new Expr.Literal(new Int32(1), this.peek().location);
        }
        while (this.match(Lexeme.Newline));

        let body = this.block(Lexeme.EndFor, Lexeme.Next);
        if (!body) {
            throw this.addError(
                this.peek(),
                "Expected 'end for' or 'next' to terminate for-loop block"
            );
        }
        let endFor = this.advance();
        while (this.match(Lexeme.Newline));

        // WARNING: BrightScript doesn't delete the loop initial value after a for/to loop! It just
        // stays around in scope with whatever value it was when the loop exited.
        return new Stmt.For(
            {
                for: forKeyword,
                to: to,
                step: step,
                endFor: endFor,
            },
            initializer,
            finalValue,
            increment,
            body
        );
    }

    private forEachStatement(): Stmt.ForEach {
        let forEach = this.advance();
        let name = this.advance();

        let maybeIn = this.peek();
        if (this.check(Lexeme.Identifier) && maybeIn.text.toLowerCase() === "in") {
            this.advance();
        } else {
            throw this.addError(maybeIn, "Expected 'in' after 'for each <name>'");
        }

        let target = this.expression();
        if (!target) {
            throw this.addError(this.peek(), "Expected target object to iterate over");
        }
        this.advance();
        while (this.match(Lexeme.Newline));

        let body = this.block(Lexeme.EndFor, Lexeme.Next);
        if (!body) {
            throw this.addError(
                this.peek(),
                "Expected 'end for' or 'next' to terminate for-loop block"
            );
        }
        let endFor = this.advance();
        while (this.match(Lexeme.Newline));

        return new Stmt.ForEach(
            {
                forEach: forEach,
                in: maybeIn,
                endFor: endFor,
            },
            name,
            target,
            body
        );
    }

    private exitFor(): Stmt.ExitFor {
        let keyword = this.advance();
        this.consume("Expected newline after 'exit for'", Lexeme.Newline);
        while (this.match(Lexeme.Newline)) {}
        return new Stmt.ExitFor({ exitFor: keyword });
    }

    private libraryStatement(): Stmt.Library | undefined {
        let libraryStatement = new Stmt.Library({
            library: this.advance(),
            //grab the next token only if it's a string
            filePath: this.check(Lexeme.String) ? this.advance() : undefined,
        });

        //no token following library keyword token
        if (!libraryStatement.tokens.filePath && this.check(Lexeme.Newline, Lexeme.Colon)) {
            this.addErrorAtLocation(
                libraryStatement.tokens.library.location,
                `Missing string literal after ${libraryStatement.tokens.library.text} keyword`
            );
        }
        //does not have a string literal as next token
        else if (!libraryStatement.tokens.filePath && this.peek().kind === Lexeme.Newline) {
            this.addErrorAtLocation(
                this.peek().location,
                `Expected string literal after ${libraryStatement.tokens.library.text} keyword`
            );
        }

        //consume all tokens until the end of the line
        let invalidTokens = this.consumeUntil(Lexeme.Newline, Lexeme.Eof, Lexeme.Colon);

        if (invalidTokens.length > 0) {
            //add an error for every invalid token
            for (let invalidToken of invalidTokens) {
                this.addErrorAtLocation(
                    invalidToken.location,
                    `Found unexpected token '${invalidToken.text}' after library statement`
                );
            }
        }

        //libraries must be at the very top of the file before any other declarations.
        let isAtTopOfFile = true;
        for (let statement of this.statements) {
            //if we found a non-library statement, this statement is not at the top of the file
            if (!(statement instanceof Stmt.Library)) {
                isAtTopOfFile = false;
            }
        }

        //libraries must be a root-level statement (i.e. NOT nested inside of functions)
        if (!this.isAtRootLevel() || !isAtTopOfFile) {
            this.addErrorAtLocation(
                libraryStatement.location,
                "Library statements may only appear at the top of a file"
            );
        }
        //consume to the next newline, eof, or colon
        while (this.match(Lexeme.Newline, Lexeme.Eof, Lexeme.Colon));
        return libraryStatement;
    }

    /**
     * A simple wrapper around `check`, to make tests for a `then` identifier.
     * As with many other words, "then" is a keyword but not reserved, so associative
     * arrays can have properties called "then".  It's a valid identifier sometimes, so the
     * parser has to take on the burden of understanding that I guess.
     * @returns `true` if the next token is an identifier with text "then", otherwise `false`.
     */
    private checkThen() {
        return this.check(Lexeme.Identifier) && this.peek().text.toLowerCase() === "then";
    }

    private ifStatement(): Stmt.If {
        const ifToken = this.advance();
        const startingLine = ifToken.location;

        const condition = this.expression();
        let thenBranch: Stmt.Block;
        let elseIfBranches: Stmt.ElseIf[] = [];
        let elseBranch: Stmt.Block | undefined;

        let thenToken: Token | undefined;
        let elseIfTokens: Token[] = [];
        let endIfToken: Token | undefined;

        if (this.checkThen()) {
            // `then` is optional after `if ...condition...`, so only advance to the next token if `then` is present
            thenToken = this.advance();
        }

        if (this.match(Lexeme.Newline) || this.match(Lexeme.Colon)) {
            //consume until no more colons
            while (this.check(Lexeme.Colon)) {
                this.advance();
            }

            //consume exactly 1 newline, if found
            if (this.check(Lexeme.Newline)) {
                this.advance();
            }

            //keep track of the current error count, because if the then branch fails,
            //we will trash them in favor of a single error on if
            let errorsLengthBeforeBlock = this.errors.length;

            // we're parsing a multi-line ("block") form of the BrightScript if/then/else and must find
            // a trailing "end if"

            let maybeThenBranch = this.block(Lexeme.EndIf, Lexeme.Else, Lexeme.ElseIf);
            if (!maybeThenBranch) {
                //throw out any new errors created as a result of a `then` block parse failure.
                //the block() function will discard the current line, so any discarded errors will
                //resurface if they are legitimate, and not a result of a malformed if statement
                this.errors.splice(
                    errorsLengthBeforeBlock,
                    this.errors.length - errorsLengthBeforeBlock
                );

                //this whole if statement is bogus...add error to the if token and hard-fail
                throw this.addError(
                    ifToken,
                    "Expected 'end if', 'else if', or 'else' to terminate 'then' block"
                );
            }

            let blockEnd = this.previous();
            if (blockEnd.kind === Lexeme.EndIf) {
                endIfToken = blockEnd;
            }

            thenBranch = maybeThenBranch;
            this.match(Lexeme.Newline);

            // attempt to read a bunch of "else if" clauses
            while (this.check(Lexeme.ElseIf)) {
                elseIfTokens.push(this.advance());
                let elseIfCondition = this.expression();
                if (this.checkThen()) {
                    // `then` is optional after `else if ...condition...`, so only advance to the next token if `then` is present
                    this.advance();
                }

                //consume any trailing colons
                while (this.check(Lexeme.Colon)) {
                    this.advance();
                }

                this.match(Lexeme.Newline);
                let elseIfThen = this.block(Lexeme.EndIf, Lexeme.Else, Lexeme.ElseIf);
                if (!elseIfThen) {
                    throw this.addError(
                        this.peek(),
                        "Expected 'end if', 'else if', or 'else' to terminate 'then' block"
                    );
                }

                let blockEnd = this.previous();
                if (blockEnd.kind === Lexeme.EndIf) {
                    endIfToken = blockEnd;
                }

                elseIfBranches.push({
                    condition: elseIfCondition,
                    thenBranch: elseIfThen,
                });
            }

            if (this.match(Lexeme.Else)) {
                //consume any trailing colons
                while (this.check(Lexeme.Colon)) {
                    this.advance();
                }

                this.match(Lexeme.Newline);
                elseBranch = this.block(Lexeme.EndIf);
                let endIfToken = this.advance(); // skip past "end if"

                //ensure that single-line `if` statements have a colon right before 'end if'
                if (ifToken.location.start.line === endIfToken.location.start.line) {
                    let index = this.tokens.indexOf(endIfToken);
                    let previousToken = this.tokens[index - 1];
                    if (previousToken.kind !== Lexeme.Colon) {
                        this.addError(endIfToken, "Expected ':' to preceed 'end if'");
                    }
                }
                this.match(Lexeme.Newline);
            } else {
                this.match(Lexeme.Newline);
                endIfToken = this.consume(
                    `Expected 'end if' to close 'if' statement started on line ${startingLine}`,
                    Lexeme.EndIf
                );

                //ensure that single-line `if` statements have a colon right before 'end if'
                if (ifToken.location.start.line === endIfToken.location.start.line) {
                    let index = this.tokens.indexOf(endIfToken);
                    let previousToken = this.tokens[index - 1];
                    if (previousToken.kind !== Lexeme.Colon) {
                        this.addError(endIfToken, "Expected ':' to preceed 'end if'");
                    }
                }
                this.match(Lexeme.Newline);
            }
        } else {
            let thenStatement = this.declaration(Lexeme.ElseIf, Lexeme.Else);
            if (!thenStatement) {
                throw this.addError(
                    this.peek(),
                    "Expected a statement to follow 'if ...condition... then'"
                );
            }
            thenBranch = new Stmt.Block([thenStatement], this.peek().location);

            while (this.match(Lexeme.ElseIf)) {
                let elseIf = this.previous();
                let elseIfCondition = this.expression();
                if (this.checkThen()) {
                    // `then` is optional after `else if ...condition...`, so only advance to the next token if `then` is present
                    this.advance();
                }

                let elseIfThen = this.declaration(Lexeme.ElseIf, Lexeme.Else);
                if (!elseIfThen) {
                    throw this.addError(
                        this.peek(),
                        `Expected a statement to follow '${elseIf.text} ...condition... then'`
                    );
                }

                elseIfBranches.push({
                    condition: elseIfCondition,
                    thenBranch: new Stmt.Block([elseIfThen], this.peek().location),
                });
            }

            if (this.match(Lexeme.Else)) {
                let elseStatement = this.declaration();
                if (!elseStatement) {
                    throw this.addError(this.peek(), `Expected a statement to follow 'else'`);
                }
                elseBranch = new Stmt.Block([elseStatement], this.peek().location);
            }
        }

        return new Stmt.If(
            {
                if: ifToken,
                then: thenToken,
                elseIfs: elseIfTokens,
                endIf: endIfToken,
            },
            condition,
            thenBranch,
            elseIfBranches,
            elseBranch
        );
    }

    /**
     * Attempts to find an expression-statement or an increment statement.
     * While calls are valid expressions _and_ statements, increment (e.g. `foo++`)
     * statements aren't valid expressions. They _do_ however fall under the same parsing
     * priority as standalone function calls though, so we cann parse them in the same way.
     */
    private expressionStatement(
        expr: Expr.Expression,
        ...additionalTerminators: BlockTerminator[]
    ): Stmt.Expression | Stmt.Increment {
        let expressionStart = this.peek();

        if (this.check(Lexeme.PlusPlus, Lexeme.MinusMinus)) {
            let operator = this.advance();

            if (this.check(Lexeme.PlusPlus, Lexeme.MinusMinus)) {
                throw this.addError(
                    this.peek(),
                    "Consecutive increment/decrement operators are not allowed"
                );
            } else if (expr instanceof Expr.Call) {
                throw this.addError(
                    expressionStart,
                    "Increment/decrement operators are not allowed on the result of a function call"
                );
            }

            while (this.match(Lexeme.Newline, Lexeme.Colon));

            return new Stmt.Increment(expr, operator);
        }

        if (!this.check(...additionalTerminators)) {
            this.consume(
                "Expected newline or ':' after expression statement",
                Lexeme.Newline,
                Lexeme.Colon,
                Lexeme.Eof
            );
        }

        if (expr instanceof Expr.Call) {
            return new Stmt.Expression(expr);
        }

        throw this.addError(
            expressionStart,
            "Expected statement or function call, but received an expression"
        );
    }

    private setStatement(
        ...additionalTerminators: BlockTerminator[]
    ): Stmt.DottedSet | Stmt.IndexedSet | Stmt.Expression | Stmt.Increment {
        let expr = this.call();
        if (this.check(...assignmentOperators) && !(expr instanceof Expr.Call)) {
            let left = expr;
            let operator = this.advance();
            let right = this.expression();

            // Create a dotted or indexed "set" based on the left-hand side's type
            if (left instanceof Expr.IndexedGet) {
                this.consume(
                    "Expected newline or ':' after indexed 'set' statement",
                    Lexeme.Newline,
                    Lexeme.Colon,
                    Lexeme.Eof
                );

                return new Stmt.IndexedSet(
                    left.obj,
                    left.index,
                    operator.kind === Lexeme.Equal ? right : new Expr.Binary(left, operator, right),
                    left.closingSquare
                );
            } else if (left instanceof Expr.DottedGet) {
                this.consume(
                    "Expected newline or ':' after dotted 'set' statement",
                    Lexeme.Newline,
                    Lexeme.Colon,
                    Lexeme.Eof
                );

                return new Stmt.DottedSet(
                    left.obj,
                    left.name,
                    operator.kind === Lexeme.Equal ? right : new Expr.Binary(left, operator, right)
                );
            } else {
                return this.expressionStatement(expr, ...additionalTerminators);
            }
        } else {
            return this.expressionStatement(expr, ...additionalTerminators);
        }
    }

    private printStatement(...additionalterminators: BlockTerminator[]): Stmt.Print {
        let printKeyword = this.advance();

        let values: (Expr.Expression | Stmt.PrintSeparator.Tab | Stmt.PrintSeparator.Space)[] = [];

        //print statements can be empty, so look for empty print conditions
        if (this.isAtEnd() || this.check(Lexeme.Newline, Lexeme.Colon)) {
            let emptyStringLiteral = new Expr.Literal(new BrsString(""), printKeyword.location);
            values.push(emptyStringLiteral);
        } else {
            values.push(this.expression());
        }

        while (
            !this.check(Lexeme.Newline, Lexeme.Colon, ...additionalterminators) &&
            !this.isAtEnd()
        ) {
            if (this.check(Lexeme.Semicolon)) {
                values.push(this.advance() as Stmt.PrintSeparator.Space);
            }

            if (this.check(Lexeme.Comma)) {
                values.push(this.advance() as Stmt.PrintSeparator.Tab);
            }

            if (!this.check(Lexeme.Newline, Lexeme.Colon) && !this.isAtEnd()) {
                values.push(this.expression());
            }
        }

        if (!this.check(...additionalterminators)) {
            this.consume(
                "Expected newline or ':' after printed values",
                Lexeme.Newline,
                Lexeme.Colon,
                Lexeme.Eof
            );
        }

        return new Stmt.Print({ print: printKeyword }, values);
    }

    /**
     * Parses a return statement with an optional return value.
     * @returns an AST representation of a return statement.
     */
    private returnStatement(): Stmt.Return {
        let tokens = { return: this.previous() };

        if (this.check(Lexeme.Colon, Lexeme.Newline, Lexeme.Eof)) {
            while (this.match(Lexeme.Colon, Lexeme.Newline, Lexeme.Eof));
            return new Stmt.Return(tokens);
        }

        let toReturn = this.expression();
        while (this.match(Lexeme.Newline, Lexeme.Colon));

        return new Stmt.Return(tokens, toReturn);
    }

    /**
     * Parses an `end` statement
     * @returns an AST representation of an `end` statement.
     */
    private endStatement() {
        let tokens = { end: this.advance() };

        while (this.match(Lexeme.Newline));

        return new Stmt.End(tokens);
    }
    /**
     * Parses a `stop` statement
     * @returns an AST representation of a `stop` statement
     */
    private stopStatement() {
        let tokens = { stop: this.advance() };

        while (this.match(Lexeme.Newline, Lexeme.Colon));

        return new Stmt.Stop(tokens);
    }

    /**
     * Parses a block, looking for a specific terminating Lexeme to denote completion.
     * @param terminators the token(s) that signifies the end of this block; all other terminators are
     *                    ignored.
     */
    private block(...terminators: BlockTerminator[]): Stmt.Block | undefined {
        let startingToken = this.peek();

        const statements: Statement[] = [];
        while (!this.check(...terminators) && !this.isAtEnd()) {
            //grab the location of the current token
            let loopCurrent = this.current;
            let dec = this.declaration();

            if (dec) {
                statements.push(dec);
            } else {
                //something went wrong. reset to the top of the loop
                this.current = loopCurrent;

                //scrap the entire line
                this.consumeUntil(Lexeme.Colon, Lexeme.Newline, Lexeme.Eof);
                //trash the newline character so we start the next iteraion on the next line
                this.advance();
            }
        }

        if (this.isAtEnd()) {
            return undefined;
            // TODO: Figure out how to handle unterminated blocks well
        }

        return new Stmt.Block(statements, startingToken.location);
    }

    private expression(): Expression {
        return this.anonymousFunction();
    }

    private anonymousFunction(): Expression {
        if (this.check(Lexeme.Sub, Lexeme.Function)) {
            return this.functionDeclaration(true);
        }

        return this.boolean();
    }

    private boolean(): Expression {
        let expr = this.relational();

        while (this.match(Lexeme.And, Lexeme.Or)) {
            let operator = this.previous();
            let right = this.relational();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private relational(): Expression {
        let expr = this.additive();

        while (
            this.match(
                Lexeme.Equal,
                Lexeme.LessGreater,
                Lexeme.Greater,
                Lexeme.GreaterEqual,
                Lexeme.Less,
                Lexeme.LessEqual
            )
        ) {
            let operator = this.previous();
            let right = this.additive();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    // TODO: bitshift

    private additive(): Expression {
        let expr = this.multiplicative();

        while (this.match(Lexeme.Plus, Lexeme.Minus)) {
            let operator = this.previous();
            let right = this.multiplicative();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private multiplicative(): Expression {
        let expr = this.exponential();

        while (this.match(Lexeme.Slash, Lexeme.Backslash, Lexeme.Star, Lexeme.Mod)) {
            let operator = this.previous();
            let right = this.exponential();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private exponential(): Expression {
        let expr = this.prefixUnary();

        while (this.match(Lexeme.Caret)) {
            let operator = this.previous();
            let right = this.prefixUnary();
            expr = new Expr.Binary(expr, operator, right);
        }

        return expr;
    }

    private prefixUnary(): Expression {
        if (this.match(Lexeme.Not, Lexeme.Minus)) {
            let operator = this.previous();
            let right = this.prefixUnary();
            return new Expr.Unary(operator, right);
        }

        return this.call();
    }

    private call(): Expression {
        let expr = this.primaryExpression();

        while (true) {
            if (this.match(Lexeme.LeftParen)) {
                expr = this.finishCall(expr);
            } else if (this.match(Lexeme.LeftSquare)) {
                while (this.match(Lexeme.Newline));

                let index = this.expression();

                while (this.match(Lexeme.Newline));
                let closingSquare = this.consume(
                    "Expected ']' after array or object index",
                    Lexeme.RightSquare
                );

                expr = new Expr.IndexedGet(expr, index, closingSquare);
            } else if (this.match(Lexeme.Dot)) {
                while (this.match(Lexeme.Newline));

                let name = this.consume(
                    "Expected property name after '.'",
                    Lexeme.Identifier,
                    ...allowedProperties
                );

                // force it into an identifier so the AST makes some sense
                name.kind = Lexeme.Identifier;

                expr = new Expr.DottedGet(expr, name as Identifier);
            } else {
                break;
            }
        }

        return expr;
    }

    private finishCall(callee: Expression): Expression {
        let args = [];
        while (this.match(Lexeme.Newline));

        if (!this.check(Lexeme.RightParen)) {
            do {
                while (this.match(Lexeme.Newline));

                if (args.length >= Expr.Call.MaximumArguments) {
                    throw this.addError(
                        this.peek(),
                        `Cannot have more than ${Expr.Call.MaximumArguments} arguments`
                    );
                }
                args.push(this.expression());
            } while (this.match(Lexeme.Comma));
        }

        while (this.match(Lexeme.Newline));
        const closingParen = this.consume(
            "Expected ')' after function call arguments",
            Lexeme.RightParen
        );

        return new Expr.Call(callee, closingParen, args);
    }

    private primaryExpression(): Expression {
        switch (true) {
            case this.match(Lexeme.False):
                return new Expr.Literal(BrsBoolean.False, this.previous().location);
            case this.match(Lexeme.True):
                return new Expr.Literal(BrsBoolean.True, this.previous().location);
            case this.match(Lexeme.Invalid):
                return new Expr.Literal(BrsInvalid.Instance, this.previous().location);
            case this.match(
                Lexeme.Integer,
                Lexeme.LongInteger,
                Lexeme.Float,
                Lexeme.Double,
                Lexeme.String
            ):
                return new Expr.Literal(this.previous().literal!, this.previous().location);
            case this.match(Lexeme.Identifier):
                return new Expr.Variable(this.previous() as Identifier);
            case this.match(Lexeme.LeftParen):
                let left = this.previous();
                let expr = this.expression();
                let right = this.consume(
                    "Unmatched '(' - expected ')' after expression",
                    Lexeme.RightParen
                );
                return new Expr.Grouping({ left, right }, expr);
            case this.match(Lexeme.LeftSquare):
                let elements: Expression[] = [];
                let openingSquare = this.previous();

                while (this.match(Lexeme.Newline));

                if (!this.match(Lexeme.RightSquare)) {
                    elements.push(this.expression());

                    while (this.match(Lexeme.Comma, Lexeme.Newline)) {
                        while (this.match(Lexeme.Newline));

                        if (this.check(Lexeme.RightSquare)) {
                            break;
                        }

                        elements.push(this.expression());
                    }

                    this.consume(
                        "Unmatched '[' - expected ']' after array literal",
                        Lexeme.RightSquare
                    );
                }

                let closingSquare = this.previous();

                //consume("Expected newline or ':' after array literal", Lexeme.Newline, Lexeme.Colon, Lexeme.Eof);
                return new Expr.ArrayLiteral(elements, openingSquare, closingSquare);
            case this.match(Lexeme.LeftBrace):
                let openingBrace = this.previous();
                let members: Expr.AAMember[] = [];

                while (this.match(Lexeme.Newline));

                if (!this.match(Lexeme.RightBrace)) {
                    members.push({
                        name: this.aaKey(),
                        value: this.expression(),
                    });

                    while (this.match(Lexeme.Comma, Lexeme.Newline, Lexeme.Colon)) {
                        while (this.match(Lexeme.Newline, Lexeme.Colon));

                        if (this.check(Lexeme.RightBrace)) {
                            break;
                        }

                        members.push({
                            name: this.aaKey(),
                            value: this.expression(),
                        });
                    }

                    this.consume(
                        "Unmatched '{' - expected '}' after associative array literal",
                        Lexeme.RightBrace
                    );
                }

                let closingBrace = this.previous();

                return new Expr.AALiteral(members, openingBrace, closingBrace);
            case this.match(Lexeme.Pos, Lexeme.Tab):
                let token = Object.assign(this.previous(), {
                    kind: Lexeme.Identifier,
                }) as Identifier;
                return new Expr.Variable(token);
            case this.check(Lexeme.Function, Lexeme.Sub):
                return this.anonymousFunction();
            default:
                throw this.addError(this.peek(), `Found unexpected token '${this.peek().text}'`);
        }
    }

    /**
     * Get an associative array key
     */
    private aaKey() {
        let k;
        if (this.check(Lexeme.Identifier, ...allowedProperties)) {
            k = new BrsString(this.advance().text!);
        } else if (this.check(Lexeme.String)) {
            k = this.advance().literal! as BrsString;
        } else {
            throw this.addError(
                this.peek(),
                `Expected identifier or string as associative array key, but received '${this.peek()
                    .text || ""}'`
            );
        }

        this.consume("Expected ':' between associative array key and value", Lexeme.Colon);
        return k;
    }

    private match(...lexemes: Lexeme[]) {
        for (let lexeme of lexemes) {
            if (this.check(lexeme)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    /**
     * Consume tokens until one of the `stopLexemes` is encountered
     * @param lexemes
     * @return - the list of tokens consumed, EXCLUDING the `stopLexeme` (you can use `this.peek()` to see which one it was)
     */
    private consumeUntil(...stopLexemes: Lexeme[]) {
        let result = [] as Token[];
        //take tokens until we encounter one of the stopLexemes
        while (!stopLexemes.includes(this.peek().kind)) {
            result.push(this.advance());
        }
        return result;
    }

    private consume(message: string, ...lexemes: Lexeme[]): Token {
        let foundLexeme = lexemes
            .map(lexeme => this.peek().kind === lexeme)
            .reduce((foundAny, foundCurrent) => foundAny || foundCurrent, false);

        if (foundLexeme) {
            return this.advance();
        }
        throw this.addError(this.peek(), message);
    }

    private advance(): Token {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }

    private check(...lexemes: Lexeme[]) {
        if (this.isAtEnd()) {
            return false;
        }

        return lexemes.some(lexeme => this.peek().kind === lexeme);
    }

    private checkNext(...lexemes: Lexeme[]) {
        if (this.isAtEnd()) {
            return false;
        }

        return lexemes.some(lexeme => this.peekNext().kind === lexeme);
    }

    private isAtEnd() {
        return this.peek().kind === Lexeme.Eof;
    }

    private peekNext() {
        if (this.isAtEnd()) {
            return this.peek();
        }
        return this.tokens[this.current + 1];
    }

    private peek() {
        return this.tokens[this.current];
    }

    private previous() {
        return this.tokens[this.current - 1];
    }

    private synchronize() {
        this.advance(); // skip the erroneous token

        while (!this.isAtEnd()) {
            if (this.previous().kind === Lexeme.Newline || this.previous().kind === Lexeme.Colon) {
                // newlines and ':' characters separate statements
                return;
            }

            switch (this.peek().kind) {
                case Lexeme.Function:
                case Lexeme.Sub:
                case Lexeme.If:
                case Lexeme.For:
                case Lexeme.ForEach:
                case Lexeme.While:
                case Lexeme.Print:
                case Lexeme.Return:
                    // start parsing again from the next block starter or obvious
                    // expression start
                    return;
            }

            this.advance();
        }
    }
}
