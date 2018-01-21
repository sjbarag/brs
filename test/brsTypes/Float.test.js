const BrsTypes = require("../../lib/brsTypes");

describe("Float", () => {
    it("doesn't rounds initial values", () => {
        let threePointFour = new BrsTypes.Float(3.4);
        let threePointFive = new BrsTypes.Float(3.5);
        expect(threePointFour.getValue()).toBeCloseTo(3.4, 5);
        expect(threePointFive.getValue()).toBeCloseTo(3.5, 5);
    });

    it("creates floats from strings", () => {
        let threePointFour = BrsTypes.Float.fromString("3.4");
        let threePointFive = BrsTypes.Float.fromString("3.5");
        expect(threePointFour.getValue()).toBeCloseTo(3.4, 5);
        expect(threePointFive.getValue()).toBeCloseTo(3.5, 5);
    });

    describe("addition", () => {
        let fivePointFive = new BrsTypes.Float(5.5);

        it("adds Int32 right-hand sides", () => {
            let four = new BrsTypes.Int32(4);
            let result = fivePointFive.add(four);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(9.5);
        });

        it("adds Int64 right-hand sides", () => {
            let four = new BrsTypes.Int64(4);
            let result = fivePointFive.add(four);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(9.5);
        });

        it("adds Float right-hand sides", () => {
            let fourPointFive = new BrsTypes.Float(4.5);
            let result = fivePointFive.add(fourPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(10);
        });

        it("adds Double right-hand sides", () => {
            let fourPointFive = new BrsTypes.Double(4.5);
            let result = fivePointFive.add(fourPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBe(10);
        });
    });

    describe("subtraction", () => {
        let fivePointFive = new BrsTypes.Float(5.5);

        it("subtracts Int32 right-hand sides", () => {
            let four = new BrsTypes.Int32(4);
            let result = fivePointFive.subtract(four);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(1.5);
        });

        it("subtracts Int64 right-hand sides", () => {
            let four = new BrsTypes.Int64(4);
            let result = fivePointFive.subtract(four);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(1.5);
        });

        it("subtracts Float right-hand sides", () => {
            let fourPointFive = new BrsTypes.Float(4.5);
            let result = fivePointFive.subtract(fourPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(1.0);
        });

        it("subtracts Double right-hand sides", () => {
            let fourPointFive = new BrsTypes.Double(4.5);
            let result = fivePointFive.subtract(fourPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBe(1.0);
        });
    });

    describe("multiplication", () => {
        let fivePointFive = new BrsTypes.Float(5.5);

        it("multiplies by Int32 right-hand sides", () => {
            let two = new BrsTypes.Int32(2);
            let result = fivePointFive.multiply(two);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(11);
        });

        it("multiplies by Int64 right-hand sides", () => {
            let two = new BrsTypes.Int64(2);
            let result = fivePointFive.multiply(two);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(11);
        });

        it("multiplies by Float right-hand sides", () => {
            let twoPointFive = new BrsTypes.Float(2.5);
            let result = fivePointFive.multiply(twoPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(13.75);
        });

        it("multiplies by Double right-hand sides", () => {
            let twoPointFive = new BrsTypes.Double(2.5);
            let result = fivePointFive.multiply(twoPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBe(13.75);
        });
    });

    describe("division", () => {
        let tenPointFive = new BrsTypes.Float(10.5);

        it("divides by Int32 right-hand sides", () => {
            let two = new BrsTypes.Int32(-2);
            let result = tenPointFive.divide(two);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(-5.25);
        });

        it("divides by Int64 right-hand sides", () => {
            let two = new BrsTypes.Int64(-2);
            let result = tenPointFive.divide(two);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(-5.25);
        });

        it("divides by Float right-hand sides", () => {
            let pointFive = new BrsTypes.Float(-0.5);
            let result = tenPointFive.divide(pointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(-21);
        });

        it("divides by Double right-hand sides", () => {
            let pointFive = new BrsTypes.Double(-0.5);
            let result = tenPointFive.divide(pointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBe(-21);
        });
    });

    describe("modulo", () => {
        let tenPointFive = new BrsTypes.Float(10.5);

        it("modulos Int32 right-hand sides", () => {
            let two = new BrsTypes.Int32(2);
            let result = tenPointFive.modulo(two);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(0.5);
        });

        it("modulos Int64 right-hand sides", () => {
            let three = new BrsTypes.Int64(3);
            let result = tenPointFive.modulo(three);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(1.5);
        });

        it("modulos Float right-hand sides", () => {
            let threePointFive = new BrsTypes.Float(3.5);
            let result = tenPointFive.modulo(threePointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(0);
        });

        it("modulos Double right-hand sides", () => {
            let twoPointFive = new BrsTypes.Double(2.5);
            let result = tenPointFive.modulo(twoPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBe(0.5);
        });
    });

    describe("integer-division", () => {
        let ten = new BrsTypes.Float(10);

        it("integer-divides by Int32 right-hand sides", () => {
            let three = new BrsTypes.Int32(3);
            let result = ten.intDivide(three);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int32);
            expect(result.getValue()).toBe(3);
        });

        it("integer-divides by Int64 right-hand sides", () => {
            let three = new BrsTypes.Int64(3);
            let result = ten.intDivide(three);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(3);
        });

        it("integer-divides by Float right-hand sides", () => {
            let threePointFive = new BrsTypes.Float(3.5);
            let result = ten.intDivide(threePointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int32);
            expect(result.getValue()).toBe(2);
        });

        it("integer-divides by Double right-hand sides", () => {
            let twoPointFive = new BrsTypes.Double(2.5);
            let result = ten.intDivide(twoPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int32);
            expect(result.getValue()).toBe(4);
        });
    });

    describe("exponentiation", () => {
        let nine = new BrsTypes.Float(1.5);

        it("raises to Int32 powers", () => {
            let two = new BrsTypes.Int32(2);
            let result = nine.pow(two);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(2.25);
        });

        it("raises to Int64 powers", () => {
            let two = new BrsTypes.Int64(2);
            let result = nine.pow(two);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(2.25);
        });

        it("raises to Float powers", () => {
            let oneHalf = new BrsTypes.Float(0.5);
            let result = nine.pow(oneHalf);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBeCloseTo(1.22474, 5);
        });

        it("raises to Double powers", () => {
            let oneHalf = new BrsTypes.Double(0.5);
            let result = nine.pow(oneHalf);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBeCloseTo(1.22474, 5);
        });
    });
});