const BrsTypes = require("../../lib/brsTypes");

describe("Int64", () => {
    it("rounds initial values to integers", () => {
        let three = new BrsTypes.Int64(3.4);
        let four = new BrsTypes.Int64(3.5);
        expect(three.getValue().toNumber()).toBe(3);
        expect(four.getValue().toNumber()).toBe(4);
    });

    it.skip("creates integers from strings", () => {
        let three = BrsTypes.Int64.fromString("3.4");
        let four = BrsTypes.Int64.fromString("3.5");
        expect(three.getValue().toNumber()).toBe(3);
        expect(four.getValue().toNumber()).toBe(4);
    });

    describe("addition", () => {
        let five = new BrsTypes.Int64(5);

        it("adds Int32 right-hand sides", () => {
            let four = new BrsTypes.Int32(4);
            let result = five.add(four);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(9);
        });

        it("adds Int64 right-hand sides", () => {
            let four = new BrsTypes.Int64(4);
            let result = five.add(four);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(9);
        });

        it("adds Float right-hand sides", () => {
            let fourPointFive = new BrsTypes.Float(4.5);
            let result = five.add(fourPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(9.5);
        });

        it("adds Double right-hand sides", () => {
            let fourPointFive = new BrsTypes.Double(4.5);
            let result = five.add(fourPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBe(9.5);
        });
    });

    describe("subtraction", () => {
        let five = new BrsTypes.Int64(5);

        it("subtracts Int32 right-hand sides", () => {
            let four = new BrsTypes.Int32(4);
            let result = five.subtract(four);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(1);
        });

        it("subtracts Int64 right-hand sides", () => {
            let four = new BrsTypes.Int64(4);
            let result = five.subtract(four);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(1);
        });

        it("subtracts Float right-hand sides", () => {
            let fourPointFive = new BrsTypes.Float(4.5);
            let result = five.subtract(fourPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(0.5);
        });

        it("subtracts Double right-hand sides", () => {
            let fourPointFive = new BrsTypes.Double(4.5);
            let result = five.subtract(fourPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBe(0.5);
        });
    });

    describe("multiplication", () => {
        let five = new BrsTypes.Int64(5);

        it("multiplies by Int32 right-hand sides", () => {
            let four = new BrsTypes.Int32(4);
            let result = five.multiply(four);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(20);
        });

        it("multiplies by Int64 right-hand sides", () => {
            let four = new BrsTypes.Int64(4);
            let result = five.multiply(four);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(20);
        });

        it("multiplies by Float right-hand sides", () => {
            let twoPointFive = new BrsTypes.Float(2.5);
            let result = five.multiply(twoPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(12.5);
        });

        it("multiplies by Double right-hand sides", () => {
            let twoPointFive = new BrsTypes.Double(2.5);
            let result = five.multiply(twoPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBe(12.5);
        });
    });

    describe("division", () => {
        let ten = new BrsTypes.Int64(10);

        it("divides by Int32 right-hand sides", () => {
            let two = new BrsTypes.Int32(-2);
            let result = ten.divide(two);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(-5);
        });

        it("divides by Int64 right-hand sides", () => {
            let two = new BrsTypes.Int64(-2);
            let result = ten.divide(two);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(-5);
        });

        it("divides by Float right-hand sides", () => {
            let pointFive = new BrsTypes.Float(-0.5);
            let result = ten.divide(pointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(-20);
        });

        it("divides by Double right-hand sides", () => {
            let pointFive = new BrsTypes.Double(-0.5);
            let result = ten.divide(pointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBe(-20);
        });
    });

    describe("modulo", () => {
        let ten = new BrsTypes.Int64(10);

        it("modulos Int32 right-hand sides", () => {
            let two = new BrsTypes.Int32(2);
            let result = ten.modulo(two);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(0);
        });

        it("modulos Int64 right-hand sides", () => {
            let three = new BrsTypes.Int64(3);
            let result = ten.modulo(three);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(1);
        });

        it("modulos Float right-hand sides", () => {
            let threePointFive = new BrsTypes.Float(3.5);
            let result = ten.modulo(threePointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int32);
            expect(result.getValue()).toBe(3);
        });

        it("modulos Double right-hand sides", () => {
            let twoPointFive = new BrsTypes.Double(2.5);
            let result = ten.modulo(twoPointFive);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int32);
            expect(result.getValue()).toBe(0);
        });
    });

    describe("integer-division", () => {
        let ten = new BrsTypes.Int64(10);

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
        let nine = new BrsTypes.Int64(9);

        it("raises to Int32 powers", () => {
            let three = new BrsTypes.Int32(3);
            let result = nine.pow(three);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(729);
        });

        it("raises to Int64 powers", () => {
            let three = new BrsTypes.Int64(3);
            let result = nine.pow(three);
            expect(result.kind).toBe(BrsTypes.NumberKind.Int64);
            expect(result.getValue().toNumber()).toBe(729);
        });

        it("raises to Float powers", () => {
            let oneHalf = new BrsTypes.Float(0.5);
            let result = nine.pow(oneHalf);
            expect(result.kind).toBe(BrsTypes.NumberKind.Float);
            expect(result.getValue()).toBe(3);
        });

        it("raises to Double powers", () => {
            let oneHalf = new BrsTypes.Double(0.5);
            let result = nine.pow(oneHalf);
            expect(result.kind).toBe(BrsTypes.NumberKind.Double);
            expect(result.getValue()).toBe(3);
        });
    });
});