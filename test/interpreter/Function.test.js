const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { identifier, token } = require("../parser/ParserTests");
const { binary } = require("./InterpreterTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Interpreter } = require("../../lib/interpreter");
const { Int32, BrsString, BrsBoolean, BrsInvalid, Callable } = require("../../lib/brsTypes");

let interpreter;

describe("interpreter function declarations", () => {
    beforeEach(() => {
        BrsError.reset();

        interpreter = new Interpreter();
    });

    it("creates function callables", () => {
        let statements = [
            new Stmt.Function(
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                [],
                new Stmt.Block([])
            )
        ];

        interpreter.exec(statements);

        let storedValue = interpreter.environment.get(
            { kind: Lexeme.Identifier, text: "foo", line: 3 }
        );
        expect(storedValue).not.toBe(BrsInvalid.Instance);
        expect(storedValue).toBeInstanceOf(Callable);
    });
});