const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { token } = require("../parser/ParserTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Interpreter } = require("../../lib/interpreter");
const BrsTypes = require("../../lib/brsTypes");

let interpreter;

describe("interpreter boolean algebra", () => {
    beforeEach(() => {
        BrsError.reset();
        interpreter = new Interpreter();
    });

    it("ANDs booleans", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(BrsTypes.BrsBoolean.True),
                token(Lexeme.And),
                new Expr.Literal(BrsTypes.BrsBoolean.False)
            )
        );

        let [result] = interpreter.exec([ast]);
        expect(result.value).toEqual(BrsTypes.BrsBoolean.False);
    });

    it("ORs booleans", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(BrsTypes.BrsBoolean.True),
                token(Lexeme.Or),
                new Expr.Literal(BrsTypes.BrsBoolean.False)
            )
        );

        let [result] = interpreter.exec([ast]);
        expect(result.value).toEqual(BrsTypes.BrsBoolean.True);
    });

    it("doesn't allow mixed-type ANDs", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(BrsTypes.BrsBoolean.True),
                token(Lexeme.And),
                new Expr.Literal(new BrsTypes.Int32(5))
            )
        );

        let [result] = interpreter.exec([ast]);
        expect(BrsError.found()).toBe(true);
        expect(result.value).toEqual(BrsTypes.BrsInvalid.Instance);
    });

    it("doesn't allow mixed-type ORs", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(BrsTypes.BrsBoolean.False),
                token(Lexeme.Or),
                new Expr.Literal(new BrsTypes.Int32(5))
            )
        );

        let [result] = interpreter.exec([ast]);
        expect(BrsError.found()).toBe(true);
        expect(result.value).toEqual(BrsTypes.BrsInvalid.Instance);
    });
});