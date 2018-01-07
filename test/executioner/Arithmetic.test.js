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

    it("adds numbers", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(5),
                token(Lexeme.Plus),
                new Expr.Literal(6)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([11]);
    });

    it("concatenates strings", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal("judge "),
                token(Lexeme.Plus),
                new Expr.Literal("judy")
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual(["judge judy"]);
    });

    it("subtracts numbers", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(3),
                token(Lexeme.Minus),
                new Expr.Literal(6)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([-3]);
    });

    it("multiplies numbers", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(7),
                token(Lexeme.Star),
                new Expr.Literal(5)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([35]);
    });

    it("divides numbers", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(9),
                token(Lexeme.Slash),
                new Expr.Literal(2)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([4.5]);
    });

    it("integer-divides numbers", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(9),
                token(Lexeme.Backslash),
                new Expr.Literal(2)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([4]);
    });

    it("modulos numbers", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(9),
                token(Lexeme.Mod),
                new Expr.Literal(2)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([1]);
    });

    it("exponentiates numbers", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(3),
                token(Lexeme.Caret),
                new Expr.Literal(3)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([27]);
    });

    it("follows arithmetic order-of-operations (PEMDAS)", () => {
        // (6 + 5) * 4 - 3 ^ 2
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Binary(
                    new Expr.Grouping(
                        new Expr.Binary(
                            new Expr.Literal(6),
                            token(Lexeme.Plus),
                            new Expr.Literal(5)
                        )
                    ),
                    token(Lexeme.Star),
                    new Expr.Literal(4)
                ),
                token(Lexeme.Minus),
                new Expr.Binary(
                    new Expr.Literal(3),
                    token(Lexeme.Caret),
                    new Expr.Literal(2)
                )
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([35]);
    });

    it("doesn't allow non-numeric negation", () => {
        let ast = new Stmt.Expression(
            new Expr.Unary(
                token(Lexeme.Minus),
                new Expr.Literal("four")
            )
        );

        let result = executioner.exec([ast]);
        expect(BrsError.found()).toBe(true);
        expect(result).toEqual([undefined]);
    });

    it("doesn't allow mixed-type arithmetic", () => {
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(3),
                token(Lexeme.Plus),
                new Expr.Literal("four")
            )
        );

        let result = executioner.exec([ast]);
        expect(BrsError.found()).toBe(true);
        expect(result).toEqual([undefined]);
    });

    it("bitwise ANDs integers", () => {
        // 110 AND 101 = 100
        // (6)     (5) = (4)
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(6),
                token(Lexeme.And),
                new Expr.Literal(5)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([4]);
    });

    it("bitwise ORs integers", () => {
        // 110 OR 011 = 111
        // (6)    (3) = (7)
        let ast = new Stmt.Expression(
            new Expr.Binary(
                new Expr.Literal(6),
                token(Lexeme.Or),
                new Expr.Literal(3)
            )
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([7]);
    });
});