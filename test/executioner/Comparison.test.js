const Long = require("long");
const BrsError = require("../../lib/Error");
const { binary } = require("./ExecutionerTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Executioner } = require("../../lib/visitor/Executioner");

let executioner;

/**
 * Generates tests that compares all permutations of two values using all supported operators.
 * @param {*} small the smaller of the two values, i.e. `small < large`.
 * @param {*} large the larger of the two values, i.e. `large > small`.
 */
function verifyComparisons(small, large) {
    test("less than", () => {
        let smallLarge = binary(small, Lexeme.Less, large);
        let smallSmall = binary(small, Lexeme.Less, small);
        let largeSmall = binary(large, Lexeme.Less, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([true, false, false]);
    });

    test("less than or equal to", () => {
        let smallLarge = binary(small, Lexeme.LessEqual, large);
        let smallSmall = binary(small, Lexeme.LessEqual, small);
        let largeSmall = binary(large, Lexeme.LessEqual, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([true, true, false]);
    });

    test("greater than", () => {
        let smallLarge = binary(small, Lexeme.Greater, large);
        let smallSmall = binary(small, Lexeme.Greater, small);
        let largeSmall = binary(large, Lexeme.Greater, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([false, false, true]);
    });

    test("greater than or equal to", () => {
        let smallLarge = binary(small, Lexeme.GreaterEqual, large);
        let smallSmall = binary(small, Lexeme.GreaterEqual, small);
        let largeSmall = binary(large, Lexeme.GreaterEqual, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([false, true, true]);
    });

    test("equal", () => {
        let smallLarge = binary(small, Lexeme.Equal, large);
        let smallSmall = binary(small, Lexeme.Equal, small);
        let largeSmall = binary(large, Lexeme.Equal, small);
        let results = executioner.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([false, true, false]);
    });

    test("not equal", () => {
        let smallLarge = binary(small, Lexeme.LessGreater, large);
        let smallSmall = binary(small, Lexeme.LessGreater, small);
        let largeSmall = binary(large, Lexeme.LessGreater, small);
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
            let less = binary(2, Lexeme.Less, "two");
            let lessEqual = binary(2, Lexeme.LessEqual, "two");
            let greater = binary(2, Lexeme.Greater, "two");
            let greaterEqual = binary(2, Lexeme.GreaterEqual, "two");
            let equal = binary(2, Lexeme.Equal, "two");
            let notEqual = binary(2, Lexeme.LessGreater, "two");
            let results = executioner.exec([less, lessEqual, greater, greaterEqual, equal, notEqual]);
            expect(results).toEqual([false, false, false, false, false, true]);
        });

        test("string and 64-bit int", () => {
            let less = binary("two", Lexeme.Less, Long.fromInt(3));
            let lessEqual = binary("two", Lexeme.LessEqual, Long.fromInt(3));
            let greater = binary("two", Lexeme.Greater, Long.fromInt(3));
            let greaterEqual = binary("two", Lexeme.GreaterEqual, Long.fromInt(3));
            let equal = binary("two", Lexeme.Equal, Long.fromInt(3));
            let notEqual = binary("two", Lexeme.LessGreater, Long.fromInt(3));
            let results = executioner.exec([less, lessEqual, greater, greaterEqual, equal, notEqual]);
            expect(results).toEqual([false, false, false, false, false, true]);
        });
    });
});