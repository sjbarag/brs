const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { token } = require("../parser/ParserTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Executioner } = require("../../lib/visitor/Executioner");

let executioner;

describe("executioner", () => {
    beforeEach(() => {
        BrsError.reset();
        executioner = new Executioner();
    });

    it("ANDs booleans", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(true),
                token(Lexeme.And),
                new Expr.Literal(false)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([false]);
    });

    it("ORs booleans", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(true),
                token(Lexeme.Or),
                new Expr.Literal(false)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([true]);
    });

    it("doesn't allow mixed-type ANDs", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(true),
                token(Lexeme.And),
                new Expr.Literal(5)
            )
        );

        let result = executioner.exec([ast]);
        expect(BrsError.found()).toBe(true);
        expect(result).toEqual([undefined]);
    });

    it("doesn't allow mixed-type ORs", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(false),
                token(Lexeme.Or),
                new Expr.Literal(5)
            )
        );

        let result = executioner.exec([ast]);
        expect(BrsError.found()).toBe(true);
        expect(result).toEqual([undefined]);
    });
});