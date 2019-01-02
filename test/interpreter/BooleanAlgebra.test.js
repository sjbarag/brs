const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { token } = require("../parser/ParserTests");
const { Lexeme, BrsTypes } = require("brs");
const { Interpreter } = require("../../lib/interpreter");

let interpreter;

describe("interpreter boolean algebra", () => {
    beforeEach(() => {
        BrsError.reset();
        interpreter = new Interpreter();
    });

    it("ANDs booleans", async () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(BrsTypes.BrsBoolean.True),
                token(Lexeme.And),
                new Expr.Literal(BrsTypes.BrsBoolean.False)
            )
        );

        let [result] = await interpreter.exec([ast]);
        expect(result).toEqual(BrsTypes.BrsBoolean.False);
    });

    it("ORs booleans", async () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(BrsTypes.BrsBoolean.True),
                token(Lexeme.Or),
                new Expr.Literal(BrsTypes.BrsBoolean.False)
            )
        );

        let [result] = await interpreter.exec([ast]);
        expect(result).toEqual(BrsTypes.BrsBoolean.True);
    });

    it("doesn't allow mixed-type ANDs", async () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(BrsTypes.BrsBoolean.True),
                token(Lexeme.And),
                new Expr.Literal(new BrsTypes.Int32(5))
            )
        );

        await expect(interpreter.exec([ast])).rejects.toThrow(/Attempting to 'and' boolean/);
        expect(BrsError.found()).toBe(true);
    });

    it("doesn't allow mixed-type ORs", async () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(BrsTypes.BrsBoolean.False),
                token(Lexeme.Or),
                new Expr.Literal(new BrsTypes.Int32(5))
            )
        );

        await expect(interpreter.exec([ast])).rejects.toThrow(/Attempting to 'or' boolean/);
        expect(BrsError.found()).toBe(true);
    });
});
