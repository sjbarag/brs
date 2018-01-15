const Long = require("long");
const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { token } = require("../parser/ParserTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Executioner } = require("../../lib/visitor/Executioner");

let executioner;

/**
 * Creates an expression AST that compares `left` and `right` with the provided `operator` lexeme.
 *
 * @param {*} left the literal to use as the left-hand side of the comparison.
 * @param {Lexeme} operator the operator to use during the comparison.
 * @param {*} right the literal to use as the right-hand side of the comparison.
 *
 * @returns An AST representing the expression `${left} ${operator} ${right}`.
 */
function comparison(left, operator, right) {
    return new Stmt.Expression(
        new Expr.Binary(
            new Expr.Literal(left),
            token(operator),
            new Expr.Literal(right)
        )
    );
}

/**
 * Generates tests that compares all permutations of two values using all supported operators.
 * @param {*} small the smaller of the two values, i.e. `small < large`.
 * @param {*} large the larger of the two values, i.e. `large > small`.
 */
function verifyComparisons(small, large) {
    test("less than", () => {
        let smallLarge = comparison(small, Lexeme.Less, large);
        let smallSmall = comparison(small, Lexeme.Less, small);
        let largeSmall = comparison(large, Lexeme.Less, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([true, false, false]);
    });

    test("less than or equal to", () => {
        let smallLarge = comparison(small, Lexeme.LessEqual, large);
        let smallSmall = comparison(small, Lexeme.LessEqual, small);
        let largeSmall = comparison(large, Lexeme.LessEqual, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([true, true, false]);
    });

    test("greater than", () => {
        let smallLarge = comparison(small, Lexeme.Greater, large);
        let smallSmall = comparison(small, Lexeme.Greater, small);
        let largeSmall = comparison(large, Lexeme.Greater, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([false, false, true]);
    });

    test("greater than or equal to", () => {
        let smallLarge = comparison(small, Lexeme.GreaterEqual, large);
        let smallSmall = comparison(small, Lexeme.GreaterEqual, small);
        let largeSmall = comparison(large, Lexeme.GreaterEqual, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([false, true, true]);
    });

    test("equal", () => {
        let smallLarge = comparison(small, Lexeme.Equal, large);
        let smallSmall = comparison(small, Lexeme.Equal, small);
        let largeSmall = comparison(large, Lexeme.Equal, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([false, true, false]);
    });

    test("not equal", () => {
        let smallLarge = comparison(small, Lexeme.LessGreater, large);
        let smallSmall = comparison(small, Lexeme.LessGreater, small);
        let largeSmall = comparison(large, Lexeme.LessGreater, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([true, false, true]);
    });
}

describe("executioner", () => {
    beforeEach(() => {
        BrsError.reset();
        executioner = new Executioner();
    });

    describe("32-bit integer comparisons", () => {
        verifyComparisons(2, 6);
    });

    describe("64-bit integer comparisons", () => {
        verifyComparisons(Long.fromString("1E33"), Long.fromString("2E33"));
    });

    describe("float comparisons", () => {
        verifyComparisons(Math.fround(2.0), Math.fround(6.0));
    });

    describe("double comparisons", () => {
        verifyComparisons(2e20, 6e20);
    });

    describe("string comparisons", () => {
        verifyComparisons("amy", "zapp");
    });

    describe("32-bit integer and double comparisons", () => {
        verifyComparisons(2.000001, 6e20);
    });

    describe("double and 32-bit integer comparisons", () => {
        verifyComparisons(2e4, 60000.000001);
    });

    describe("float and 64-bit integer comparisons", () => {
        verifyComparisons(Math.fround(2.0), Long.fromNumber(6));
    });

    describe("64-bit integer and float comparisons", () => {
        verifyComparisons(Long.fromNumber(2), Math.fround(6.0));
    });

    describe("invalid mixed-type comparisons", () => {
        // due to a combinatoric explosion of LHS-RHS-operator pairs, just test a representative
        // sample of pairings
        test("32-bit integer and string", () => {
            let less = comparison(2, Lexeme.Less, "two");
            let lessEqual = comparison(2, Lexeme.LessEqual, "two");
            let greater = comparison(2, Lexeme.Greater, "two");
            let greaterEqual = comparison(2, Lexeme.GreaterEqual, "two");
            let equal = comparison(2, Lexeme.Equal, "two");
            let notEqual = comparison(2, Lexeme.LessGreater, "two");
            let results = executioner.exec([less, lessEqual, greater, greaterEqual, equal, notEqual]);
            expect(results).toEqual([false, false, false, false, false, true]);
        });

        test("string and 64-bit int", () => {
            let less = comparison("two", Lexeme.Less, Long.fromInt(3));
            let lessEqual = comparison("two", Lexeme.LessEqual, Long.fromInt(3));
            let greater = comparison("two", Lexeme.Greater, Long.fromInt(3));
            let greaterEqual = comparison("two", Lexeme.GreaterEqual, Long.fromInt(3));
            let equal = comparison("two", Lexeme.Equal, Long.fromInt(3));
            let notEqual = comparison("two", Lexeme.LessGreater, Long.fromInt(3));
            let results = executioner.exec([less, lessEqual, greater, greaterEqual, equal, notEqual]);
            expect(results).toEqual([false, false, false, false, false, true]);
        });
    });
});