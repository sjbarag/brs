const BrsTypes = require("../../lib/brsTypes");

describe("Int32", () => {
    it("rounds initial values to integers", () => {
        let three = new BrsTypes.Int32(3.4);
        let four = new BrsTypes.Int32(3.5);
        expect(three.getValue()).toBe(3);
        expect(four.getValue()).toBe(4);
    });

    it("creates integers from strings", () => {
        let three = BrsTypes.Int32.fromString("3.4");
        let four = BrsTypes.Int32.fromString("3.5");
        expect(three.getValue()).toBe(3);
        expect(four.getValue()).toBe(4);
    });

    describe("addition", () => {
        let five = new BrsTypes.Int32(5);

        it("adds Int32 right-hand sides", () => {
            let four = new BrsTypes.Int32(4);
            let result = five.add(four);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int32);
            expect(result.getValue()).toBe(9);
        });

        it("adds Int64 right-hand sides", () => {
            let four = new BrsTypes.Int64(4);
            let result = five.add(four);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int64);
            expect(result.getValue().toNumber()).toBe(9);
        });

        it("adds Float right-hand sides", () => {
            let fourPointFive = new BrsTypes.Float(4.5);
            let result = five.add(fourPointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Float);
            expect(result.getValue()).toBe(9.5);
        });

        it("adds Double right-hand sides", () => {
            let fourPointFive = new BrsTypes.Double(4.5);
            let result = five.add(fourPointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Double);
            expect(result.getValue()).toBe(9.5);
        });
    });

    describe("subtraction", () => {
        let five = new BrsTypes.Int32(5);

        it("subtracts Int32 right-hand sides", () => {
            let four = new BrsTypes.Int32(4);
            let result = five.subtract(four);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int32);
            expect(result.getValue()).toBe(1);
        });

        it("subtracts Int64 right-hand sides", () => {
            let four = new BrsTypes.Int64(4);
            let result = five.subtract(four);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int64);
            expect(result.getValue().toNumber()).toBe(1);
        });

        it("subtracts Float right-hand sides", () => {
            let fourPointFive = new BrsTypes.Float(4.5);
            let result = five.subtract(fourPointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Float);
            expect(result.getValue()).toBe(0.5);
        });

        it("subtracts Double right-hand sides", () => {
            let fourPointFive = new BrsTypes.Double(4.5);
            let result = five.subtract(fourPointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Double);
            expect(result.getValue()).toBe(0.5);
        });
    });

    describe("multiplication", () => {
        let five = new BrsTypes.Int32(5);

        it("multiplies by Int32 right-hand sides", () => {
            let four = new BrsTypes.Int32(4);
            let result = five.multiply(four);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int32);
            expect(result.getValue()).toBe(20);
        });

        it("multiplies by Int64 right-hand sides", () => {
            let four = new BrsTypes.Int64(4);
            let result = five.multiply(four);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int64);
            expect(result.getValue().toNumber()).toBe(20);
        });

        it("multiplies by Float right-hand sides", () => {
            let twoPointFive = new BrsTypes.Float(2.5);
            let result = five.multiply(twoPointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Float);
            expect(result.getValue()).toBe(12.5);
        });

        it("multiplies by Double right-hand sides", () => {
            let twoPointFive = new BrsTypes.Double(2.5);
            let result = five.multiply(twoPointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Double);
            expect(result.getValue()).toBe(12.5);
        });
    });

    describe("division", () => {
        let ten = new BrsTypes.Int32(10);

        it("divides by Int32 right-hand sides", () => {
            let two = new BrsTypes.Int32(-2);
            let result = ten.divide(two);
            expect(result.kind).toBe(BrsTypes.ValueKind.Float);
            expect(result.getValue()).toBe(-5);
        });

        it("divides by Int64 right-hand sides", () => {
            let two = new BrsTypes.Int64(-2);
            let result = ten.divide(two);
            expect(result.kind).toBe(BrsTypes.ValueKind.Float);
            expect(result.getValue()).toBe(-5);
        });

        it("divides by Float right-hand sides", () => {
            let pointFive = new BrsTypes.Float(-0.5);
            let result = ten.divide(pointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Float);
            expect(result.getValue()).toBe(-20);
        });

        it("divides by Double right-hand sides", () => {
            let pointFive = new BrsTypes.Double(-0.5);
            let result = ten.divide(pointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Double);
            expect(result.getValue()).toBe(-20);
        });
    });

    describe("modulo", () => {
        let ten = new BrsTypes.Int32(10);

        it("modulos Int32 right-hand sides", () => {
            let two = new BrsTypes.Int32(2);
            let result = ten.modulo(two);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int32);
            expect(result.getValue()).toBe(0);
        });

        it("modulos Int64 right-hand sides", () => {
            let three = new BrsTypes.Int64(3);
            let result = ten.modulo(three);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int64);
            expect(result.getValue().toNumber()).toBe(1);
        });

        it("modulos Float right-hand sides", () => {
            let threePointFive = new BrsTypes.Float(3.25);
            let result = ten.modulo(threePointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Float);
            expect(result.getValue()).toBe(0.25);
        });

        it("modulos Double right-hand sides", () => {
            let twoPointFive = new BrsTypes.Double(2.75);
            let result = ten.modulo(twoPointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Double);
            expect(result.getValue()).toBe(1.75);
        });
    });

    describe("integer-division", () => {
        let ten = new BrsTypes.Int32(10);

        it("integer-divides by Int32 right-hand sides", () => {
            let three = new BrsTypes.Int32(3);
            let result = ten.intDivide(three);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int32);
            expect(result.getValue()).toBe(3);
        });

        it("integer-divides by Int64 right-hand sides", () => {
            let three = new BrsTypes.Int64(3);
            let result = ten.intDivide(three);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int64);
            expect(result.getValue().toNumber()).toBe(3);
        });

        it("integer-divides by Float right-hand sides", () => {
            let threePointFive = new BrsTypes.Float(3.5);
            let result = ten.intDivide(threePointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int32);
            expect(result.getValue()).toBe(2);
        });

        it("integer-divides by Double right-hand sides", () => {
            let twoPointFive = new BrsTypes.Double(2.5);
            let result = ten.intDivide(twoPointFive);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int32);
            expect(result.getValue()).toBe(4);
        });
    });

    describe("exponentiation", () => {
        let nine = new BrsTypes.Int32(9);

        it("raises to Int32 powers", () => {
            let three = new BrsTypes.Int32(3);
            let result = nine.pow(three);
            expect(result.kind).toBe(BrsTypes.ValueKind.Float);
            expect(result.getValue()).toBe(729);
        });

        it("raises to Int64 powers", () => {
            let three = new BrsTypes.Int64(3);
            let result = nine.pow(three);
            expect(result.kind).toBe(BrsTypes.ValueKind.Int64);
            expect(result.getValue().toNumber()).toBe(729);
        });

        it("raises to Float powers", () => {
            let oneHalf = new BrsTypes.Float(0.5);
            let result = nine.pow(oneHalf);
            expect(result.kind).toBe(BrsTypes.ValueKind.Float);
            expect(result.getValue()).toBe(3);
        });

        it("raises to Double powers", () => {
            let oneHalf = new BrsTypes.Double(0.5);
            let result = nine.pow(oneHalf);
            expect(result.kind).toBe(BrsTypes.ValueKind.Double);
            expect(result.getValue()).toBe(3);
        });
    });

    describe("less than", () => {
        const lhs = new BrsTypes.Int32(2);

        function testLessThan(operands) {
            expect(lhs.lessThan(operands.large)).toBe(BrsTypes.BrsBoolean.True);
            expect(lhs.lessThan(operands.small)).toBe(BrsTypes.BrsBoolean.False);
        }

        it("compares to Int32 right-hand sides", () =>
            testLessThan({
                lhs: lhs,
                small: new BrsTypes.Int32(1),
                large: new BrsTypes.Int32(3)
            })
        );

        it("compares to Int64 right-hand sides", () =>
            testLessThan({
                lhs: lhs,
                small: new BrsTypes.Int64(1),
                large: new BrsTypes.Int64(Math.pow(10, 18))
            })
        );

        it("compares to Float right-hand sides", () =>
            testLessThan({
                lhs: lhs,
                small: new BrsTypes.Float(0.12345),
                large: new BrsTypes.Float(2.001)
            })
        );

        it("compares to Double right-hand sides", () =>
            testLessThan({
                lhs: lhs,
                small: new BrsTypes.Double(1.999999999),
                large: new BrsTypes.Double(2.000000001)
            })
        );

        it("returns false for all other types", () => {
            let nonNumbers = [
                new BrsTypes.BrsString("hello"),
                BrsTypes.BrsBoolean.True,
                BrsTypes.BrsInvalid.Instance
            ];
            nonNumbers.forEach((rhs) => expect(lhs.lessThan(rhs)).toBe(BrsTypes.BrsBoolean.False));
        });
    });

    describe("greater than", () => {
        const lhs = new BrsTypes.Int32(2);

        function testGreaterThan(operands) {
            expect(lhs.greaterThan(operands.large)).toBe(BrsTypes.BrsBoolean.False);
            expect(lhs.greaterThan(operands.small)).toBe(BrsTypes.BrsBoolean.True);
        }

        it("compares to Int32 right-hand sides", () =>
            testGreaterThan({
                lhs: lhs,
                small: new BrsTypes.Int32(1),
                large: new BrsTypes.Int32(3)
            })
        );

        it("compares to Int64 right-hand sides", () =>
            testGreaterThan({
                lhs: lhs,
                small: new BrsTypes.Int64(1),
                large: new BrsTypes.Int64(Math.pow(10, 18))
            })
        );

        it("compares to Float right-hand sides", () =>
            testGreaterThan({
                lhs: lhs,
                small: new BrsTypes.Float(0.12345),
                large: new BrsTypes.Float(2.001)
            })
        );

        it("compares to Double right-hand sides", () =>
            testGreaterThan({
                lhs: lhs,
                small: new BrsTypes.Double(1.999999999),
                large: new BrsTypes.Double(2.000000001)
            })
        );

        it("returns false for all other types", () => {
            let nonNumbers = [
                new BrsTypes.BrsString("hello"),
                BrsTypes.BrsBoolean.True,
                BrsTypes.BrsInvalid.Instance
            ];
            nonNumbers.forEach((rhs) => expect(lhs.greaterThan(rhs)).toBe(BrsTypes.BrsBoolean.False));
        });
    });

    describe("equal to", () => {
        const lhs = new BrsTypes.Int32(2);

        function testGreaterThan(operands) {
            expect(lhs.equalTo(operands.same)).toBe(BrsTypes.BrsBoolean.True);
            expect(lhs.equalTo(operands.diff)).toBe(BrsTypes.BrsBoolean.False);
        }

        it("compares to Int32 right-hand sides", () =>
            testGreaterThan({
                lhs: lhs,
                same: lhs,
                diff: new BrsTypes.Int32(3)
            })
        );

        it("compares to Int64 right-hand sides", () =>
            testGreaterThan({
                lhs: lhs,
                same: new BrsTypes.Int64(2),
                diff: new BrsTypes.Int64(Math.pow(10, 18))
            })
        );

        it("compares to Float right-hand sides", () =>
            testGreaterThan({
                lhs: lhs,
                same: new BrsTypes.Float(2),
                diff: new BrsTypes.Float(2.001)
            })
        );

        it("compares to Double right-hand sides", () =>
            testGreaterThan({
                lhs: lhs,
                same: new BrsTypes.Double(2),
                diff: new BrsTypes.Double(2.000000001)
            })
        );

        it("returns false for all other types", () => {
            let nonNumbers = [
                new BrsTypes.BrsString("hello"),
                BrsTypes.BrsBoolean.True,
                BrsTypes.BrsInvalid.Instance
            ];
            nonNumbers.forEach((rhs) => expect(lhs.equalTo(rhs)).toBe(BrsTypes.BrsBoolean.False));
        });
    });
});