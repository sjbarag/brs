const Long = require("long");
const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { token } = require("../parser/ParserTests");
const { binary } = require("./ExecutionerTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Executioner } = require("../../lib/visitor/Executioner");

let executioner;

describe("executioner", () => {
    beforeEach(() => {
        BrsError.reset();
        executioner = new Executioner();
    });

    describe("addition", () => {
        it("adds 64-bit integers", () => {
            let leftLong = binary(Long.fromNumber(5), Lexeme.Plus, 4);
            let rightLong = binary(5, Lexeme.Plus, Long.fromNumber(4));
            let bothLong = binary(Long.fromInt(5), Lexeme.Plus, Long.fromInt(4));

            let results = executioner.exec([leftLong, rightLong, bothLong]);
            let nine = Long.fromInt(9);
            expect(results).toEqual([nine, nine, nine]);
        })

        it("adds 32-bit integers", () => {
            let ast = binary(5, Lexeme.Plus, 6);
            let result = executioner.exec([ast]);
            expect(result).toEqual([11]);
        });

        it("adds floats", () => {
            let ast = binary(5e-5, Lexeme.Plus, 6e-5);
            let result = executioner.exec([ast]);
            expect(result).toEqual([11e-5]);
        })

        it("adds doubles", () => {
            let ast = binary(5e25, Lexeme.Plus, 6e25);
            let result = executioner.exec([ast]);
            expect(result).toEqual([11e25]);
        })
    });


    it("concatenates strings", () => {
        let ast = binary("judge ", Lexeme.Plus, "judy");
        let result = executioner.exec([ast]);
        expect(result).toEqual(["judge judy"]);
    });

    describe("subtraction", () => {
        it("subtracts 64-bit integers", () => {
            let leftLong = binary(Long.fromInt(11), Lexeme.Minus, 2);
            let rightLong = binary(11, Lexeme.Minus, Long.fromInt(2));
            let bothLong = binary(
                Long.fromInt(11),
                Lexeme.Minus,
                Long.fromInt(2)
            );
            let results = executioner.exec([leftLong, rightLong, bothLong]);
            let nine = Long.fromInt(9);
            expect(results).toEqual([nine, nine, nine]);
        });

        it("subtracts 32-bit integers", () => {
            let ast = binary(11, Lexeme.Minus, 2);
            let results = executioner.exec([ast]);
            expect(results).toEqual([9]);
        });

        it("subtracts floats", () => {
            let ast = binary(11e-5, Lexeme.Minus, 2e-5);
            let result = executioner.exec([ast]);
            expect(result).toEqual([9e-5]);
        });

        it("subtracts doubles", () => {
            let ast = binary(11e25, Lexeme.Minus, 2e25);
            let result = executioner.exec([ast]);
            expect(result).toEqual([9e25]);
        });
    });

    describe("multiplication", () => {
        it("multiplies 64-bit integers", () => {
            let leftLong = binary(Long.fromInt(5), Lexeme.Star, 2);
            let rightLong = binary(5, Lexeme.Star, Long.fromInt(2));
            let bothLong = binary(Long.fromInt(5), Lexeme.Star, Long.fromInt(2));
            let results = executioner.exec([leftLong, rightLong, bothLong]);
            let ten = Long.fromInt(10);
            expect(results).toEqual([ten, ten, ten]);
        });

        it("multiplies 32-bit integers", () => {
            let ast = binary(2, Lexeme.Star, 5);
            let results = executioner.exec([ast]);
            expect(results).toEqual([10]);
        });

        it("multiplies floats", () => {
            let ast = binary(2e-3, Lexeme.Star, 5e-4);
            let result = executioner.exec([ast]);
            expect(result).toEqual([10e-7]);
        });

        it("multiplies doubles", () => {
            let ast = binary(2e15, Lexeme.Star, 5e5);
            let result = executioner.exec([ast]);
            expect(result).toEqual([10e20]);
        });
    });

    describe("division", () => {
        it("divides 64-bit integers", () => {
            let leftLong = binary(Long.fromInt(5), Lexeme.Slash, 2);
            let rightLong = binary(5, Lexeme.Slash, Long.fromInt(2));
            let bothLong = binary(Long.fromInt(5), Lexeme.Slash, Long.fromInt(2));
            let results = executioner.exec([leftLong, rightLong, bothLong]);
            expect(results).toEqual([2.5, 2.5, 2.5]);
        });

        it("divides 32-bit integers", () => {
            let ast = binary(5, Lexeme.Slash, 2);
            let results = executioner.exec([ast]);
            expect(results).toEqual([2.5]);
        });

        it("divides floats", () => {
            let ast = binary(5e-3, Lexeme.Slash, 2e-4);
            let result = executioner.exec([ast]);
            expect(result).toEqual([25]);
        });

        it("divides doubles", () => {
            let ast = binary(5e15, Lexeme.Slash, 2e5);
            let result = executioner.exec([ast]);
            expect(result).toEqual([2.5e10]);
        });
    });

    describe("integer-division", () => {
        it("integer-divides 64-bit integers", () => {
            let leftLong = binary(Long.fromInt(5), Lexeme.Backslash, 2);
            let rightLong = binary(5, Lexeme.Backslash, Long.fromInt(2));
            let bothLong = binary(Long.fromInt(5), Lexeme.Backslash, Long.fromInt(2));
            let results = executioner.exec([leftLong, rightLong, bothLong]);
            let two = Long.fromNumber(2);
            expect(results).toEqual([two, 2, two]);
        });

        it("integer-divides 32-bit integers", () => {
            let ast = binary(5, Lexeme.Backslash, 2);
            let results = executioner.exec([ast]);
            expect(results).toEqual([2]);
        });

        it("integer-divides floats", () => {
            let ast = binary(5e-3, Lexeme.Backslash, 2e-3);
            let result = executioner.exec([ast]);
            expect(result).toEqual([2]);
        });

        it("integer-divides doubles", () => {
            let ast = binary(5e15, Lexeme.Backslash, 2e15);
            let result = executioner.exec([ast]);
            expect(result).toEqual([2]);
        });
    });

    describe("modulo", () => {
        it("modulos 64-bit integers", () => {
            let leftLong = binary(Long.fromInt(5), Lexeme.Mod, 2);
            let rightLong = binary(5, Lexeme.Mod, Long.fromInt(2));
            let bothLong = binary(Long.fromInt(5), Lexeme.Mod, Long.fromInt(2));
            let results = executioner.exec([leftLong, rightLong, bothLong]);
            expect(results).toEqual([Long.ONE, Long.ONE, Long.ONE]);
        });

        it("modulos 32-bit integers", () => {
            let ast = binary(5, Lexeme.Mod, 2);
            let results = executioner.exec([ast]);
            expect(results).toEqual([1]);
        });

        it("modulos floats", () => {
            let ast = binary(5e-3 + 5, Lexeme.Mod, 5e-3 + 2);
            let result = executioner.exec([ast]);
            // TODO: Figure out how to make node behave properly here
            // expect(result).toEqual([1]);
        });

        it("modulos doubles", () => {
            let ast = binary(5e5 + 5, Lexeme.Mod, 5e5 + 2);
            let result = executioner.exec([ast]);
            expect(result).toEqual([3]);
        });
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