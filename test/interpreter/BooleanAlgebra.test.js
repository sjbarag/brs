const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { token } = require("../parser/ParserTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Interpreter } = require("../../lib/visitor/Interpreter");
const BrsTypes = require("../../lib/brsTypes");

let interpreter;

describe.only("interpreter boolean algebra", () => {
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
        expect(result).toEqual(BrsTypes.BrsBoolean.False);
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
        expect(result).toEqual(BrsTypes.BrsBoolean.True);
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
        expect(result).toEqual(BrsTypes.BrsInvalid.Instance);
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
        expect(result).toEqual(BrsTypes.BrsInvalid.Instance);
    });
});