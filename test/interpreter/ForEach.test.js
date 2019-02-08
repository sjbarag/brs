const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { Interpreter } = require("../../lib/interpreter");
const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsString } = brs.types;

const { token, identifier } = require("../parser/ParserTests");

let interpreter;

describe("interpreter for-each loops", () => {
    const arrayMembers = [
            new BrsString("foo"),
            new BrsString("bar"),
            new BrsString("baz")
    ];

    beforeEach(() => {
        interpreter = new Interpreter();
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it("iterates across all elements of an array", () => {
        const emptyBlock = new Stmt.Block([]);
        const receivedElements = [];
        const emptyBlockSpy = jest.spyOn(emptyBlock, "accept").mockImplementation(_interpreter =>
            receivedElements.push(
                _interpreter.environment.get(
                    token(Lexeme.Identifier, "element")
                )
            )
        );

        const statements = [
            new Stmt.Assignment(
                token(Lexeme.Identifier, "array"),
                new Expr.ArrayLiteral(
                    arrayMembers.map(member => new Expr.Literal(member))
                )
            ),
            new Stmt.ForEach(
                token(Lexeme.Identifier, "element"),
                new Expr.Variable(token(Lexeme.Identifier, "array")),
                emptyBlock
            )
        ];

        interpreter.exec(statements);

        expect(emptyBlockSpy).toHaveBeenCalledTimes(3);
        expect(receivedElements).toEqual(arrayMembers);
    });

    it("doesn't exceute the body for empty arrays", () => {
        const emptyBlock = new Stmt.Block([]);
        const emptyBlockSpy = jest.spyOn(emptyBlock, "accept");

        const statements = [
            new Stmt.Assignment(
                token(Lexeme.Identifier, "empty"),
                new Expr.ArrayLiteral([])
            ),
            new Stmt.ForEach(
                token(Lexeme.Identifier, "element"),
                new Expr.Variable(token(Lexeme.Identifier, "empty")),
                emptyBlock
            )
        ];

        interpreter.exec(statements);

        expect(emptyBlockSpy).not.toHaveBeenCalled();
    });

    it("leaves the loop variable in-scope after loop", () => {
        const emptyBlock = new Stmt.Block([]);

        const statements = [
            new Stmt.Assignment(
                token(Lexeme.Identifier, "array"),
                new Expr.ArrayLiteral(
                    arrayMembers.map(member => new Expr.Literal(member))
                )
            ),
            new Stmt.ForEach(
                token(Lexeme.Identifier, "element"),
                new Expr.Variable(token(Lexeme.Identifier, "array")),
                emptyBlock
            )
        ];

        interpreter.exec(statements);

        expect(
            interpreter.environment.get(
                token(Lexeme.Identifier, "element")
            )
        ).toEqual(arrayMembers[arrayMembers.length - 1]);
    });

    it("exits early when it encounters 'exit for'", () => {
        const block = new Stmt.Block([
            new Stmt.ExitFor()
        ]);
        const blockSpy = jest.spyOn(block, "accept");

        const statements = [
            new Stmt.Assignment(
                token(Lexeme.Identifier, "array"),
                new Expr.ArrayLiteral(
                    arrayMembers.map(member => new Expr.Literal(member))
                )
            ),
            new Stmt.ForEach(
                token(Lexeme.Identifier, "element"),
                new Expr.Variable(token(Lexeme.Identifier, "array")),
                block
            )
        ];

        interpreter.exec(statements);

        expect(blockSpy).toHaveBeenCalledTimes(1);
    });
});