const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { identifier, token } = require("../parser/ParserTests");
const { binary } = require("./InterpreterTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Interpreter } = require("../../lib/interpreter");
const { Int32, BrsString, BrsBoolean, BrsInvalid, Callable, ValueKind } = require("../../lib/brsTypes");

let interpreter;

describe("interpreter function expressions", () => {
    beforeEach(() => {
        BrsError.reset();

        interpreter = new Interpreter();
    });

    it("creates callable functions", () => {
        let emptyBlock = new Stmt.Block([]);
        jest.spyOn(emptyBlock, "accept");

        let statements = [
            new Expr.Call(
                new Expr.Grouping(
                    new Expr.Function(
                        [],
                        ValueKind.Void,
                        emptyBlock
                    )
                ),
                { kind: Lexeme.RightParen, text: ")", line: 2 },
                []
            )
        ];

        interpreter.exec(statements);
        expect(BrsError.found()).toBe(false);

        expect(emptyBlock.accept).toHaveBeenCalledTimes(1);
    });
});