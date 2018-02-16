const Long = require("long");
const BrsError = require("../../lib/Error");
const { binary } = require("./InterpreterTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Interpreter } = require("../../lib/visitor/Interpreter");
const { Int32, Int64, Float, Double, BrsString, BrsBoolean, BrsInvalid } = require("../../lib/brsTypes");

let interpreter;

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
        let results = interpreter.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([BrsBoolean.True, BrsBoolean.False, BrsBoolean.False]);
    });

    test("less than or equal to", () => {
        let smallLarge = binary(small, Lexeme.LessEqual, large);
        let smallSmall = binary(small, Lexeme.LessEqual, small);
        let largeSmall = binary(large, Lexeme.LessEqual, small);
        let results = interpreter.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([BrsBoolean.True, BrsBoolean.True, BrsBoolean.False]);
    });

    test("greater than", () => {
        let smallLarge = binary(small, Lexeme.Greater, large);
        let smallSmall = binary(small, Lexeme.Greater, small);
        let largeSmall = binary(large, Lexeme.Greater, small);
        let results = interpreter.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([BrsBoolean.False, BrsBoolean.False, BrsBoolean.True]);
    });

    test("greater than or equal to", () => {
        let smallLarge = binary(small, Lexeme.GreaterEqual, large);
        let smallSmall = binary(small, Lexeme.GreaterEqual, small);
        let largeSmall = binary(large, Lexeme.GreaterEqual, small);
        let results = interpreter.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([BrsBoolean.False, BrsBoolean.True, BrsBoolean.True]);
    });

    test("equal", () => {
        let smallLarge = binary(small, Lexeme.Equal, large);
        let smallSmall = binary(small, Lexeme.Equal, small);
        let largeSmall = binary(large, Lexeme.Equal, small);
        let results = interpreter.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([BrsBoolean.False, BrsBoolean.True, BrsBoolean.False]);
    });

    test("not equal", () => {
        let smallLarge = binary(small, Lexeme.LessGreater, large);
        let smallSmall = binary(small, Lexeme.LessGreater, small);
        let largeSmall = binary(large, Lexeme.LessGreater, small);
        let results = interpreter.exec([smallLarge, smallSmall, largeSmall]);
        expect(results).toEqual([BrsBoolean.True, BrsBoolean.False, BrsBoolean.True]);
    });
}

describe("interpreter comparisons", () => {
    beforeEach(() => {
        BrsError.reset();
        interpreter = new Interpreter();
    });

    describe("32-bit integer comparisons", () => {
        verifyComparisons(new Int32(2), new Int32(6));
    });

    describe("64-bit integer comparisons", () => {
        verifyComparisons(new Int64(Math.pow(10, 17)), new Int64(20 * Math.pow(10, 18)));
    });

    describe("float comparisons", () => {
        verifyComparisons(new Float(2), new Float(6));
    });

    describe("double comparisons", () => {
        verifyComparisons(new Double(2), new Double(6));
    });

    describe("string comparisons", () => {
        verifyComparisons(new BrsString("amy"), new BrsString("zapp"));
    });

    describe("invalid mixed-type comparisons", () => {
        let int32 = new Int32(2);
        let str = new BrsString("two");
        let int64 = new Int64(2);

        // due to a combinatoric explosion of LHS-RHS-operator pairs, just test a representative
        // sample of pairings
        test("32-bit integer and string", () => {
            let less = binary(int32, Lexeme.Less, str);
            let lessEqual = binary(int32, Lexeme.LessEqual, str);
            let greater = binary(int32, Lexeme.Greater, str);
            let greaterEqual = binary(int32, Lexeme.GreaterEqual, str);
            let equal = binary(int32, Lexeme.Equal, str);
            let notEqual = binary(int32, Lexeme.LessGreater, str);
            let results = interpreter.exec([less, lessEqual, greater, greaterEqual, equal, notEqual]);
            expect(results).toEqual([
                BrsBoolean.False,
                BrsBoolean.False,
                BrsBoolean.False,
                BrsBoolean.False,
                BrsBoolean.False,
                BrsBoolean.True
            ]);
        });

        test("string and 64-bit int", () => {
            let less = binary(str, Lexeme.Less, int64);
            let lessEqual = binary(str, Lexeme.LessEqual, int64);
            let greater = binary(str, Lexeme.Greater, int64);
            let greaterEqual = binary(str, Lexeme.GreaterEqual, int64);
            let equal = binary(str, Lexeme.Equal, int64);
            let notEqual = binary(str, Lexeme.LessGreater, int64);
            let results = interpreter.exec([less, lessEqual, greater, greaterEqual, equal, notEqual]);
            expect(results).toEqual([
                BrsBoolean.False,
                BrsBoolean.False,
                BrsBoolean.False,
                BrsBoolean.False,
                BrsBoolean.False,
                BrsBoolean.True
            ]);
        });
    });
});