const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Expr } = brs.parser;
const { Int32, BrsBoolean } = brs.types;

const { FileCoverage } = require("../../../lib/coverage/FileCoverage");
const { generateLocation, token, identifier, locationEqual} = require("./utils");

describe("FileCoverage expressions", () => {
    describe("Binary", () => {
        test("less than", () => {
            let expression = new Expr.Binary(
                new Expr.Literal(new Int32(1)),
                token(Lexeme.Less),
                new Expr.Literal(new Int32(2))
            );

            let fileCoverage = new FileCoverage("path/to/file");
            fileCoverage.evaluate(expression);

            let coverageResults = fileCoverage.getCoverage();
            expect(Object.keys(coverageResults.functions).length).toEqual(0);
            expect(Object.keys(coverageResults.statements).length).toEqual(0);
            expect(Object.keys(coverageResults.branches).length).toEqual(0); // less than is not a branch, so don't count it
        });

        describe("and", () => {
            test("left side is evaluated", () => {
                let expression = new Expr.Binary(
                    new Expr.Literal(BrsBoolean.True, generateLocation(1)),
                    token(Lexeme.And),
                    new Expr.Literal(BrsBoolean.True, generateLocation(2))
                );

                let fileCoverage = new FileCoverage("path/to/file");
                fileCoverage.evaluate(expression);
                fileCoverage.logHit(expression.left);

                let coverageResults = fileCoverage.getCoverage();
                expect(Object.keys(coverageResults.functions).length).toEqual(0);
                expect(Object.keys(coverageResults.statements).length).toEqual(0);

                let key = fileCoverage.getStatementKey(expression);
                let branch = coverageResults.branches[key];

                expect(branch.type).toEqual("And");
                expect(branch.hits[0]).toEqual(1);
                expect(locationEqual(branch.locations[0], generateLocation(1))).toBeTruthy();
                expect(branch.hits[1]).toEqual(0);
                expect(locationEqual(branch.locations[1], generateLocation(2))).toBeTruthy();
            });

            test("both sides are evaluated", () => {
                let expression = new Expr.Binary(
                    new Expr.Literal(BrsBoolean.True, generateLocation(1)),
                    token(Lexeme.And),
                    new Expr.Literal(BrsBoolean.True, generateLocation(2))
                );

                let fileCoverage = new FileCoverage("path/to/file");
                fileCoverage.evaluate(expression);
                fileCoverage.logHit(expression.left);
                fileCoverage.logHit(expression.right);

                let coverageResults = fileCoverage.getCoverage();
                expect(Object.keys(coverageResults.functions).length).toEqual(0);
                expect(Object.keys(coverageResults.statements).length).toEqual(0);

                let key = fileCoverage.getStatementKey(expression);
                let branch = coverageResults.branches[key];

                expect(branch.type).toEqual("And");
                expect(branch.hits[0]).toEqual(1);
                expect(locationEqual(branch.locations[0], generateLocation(1))).toBeTruthy();
                expect(branch.hits[1]).toEqual(1);
                expect(locationEqual(branch.locations[1], generateLocation(2))).toBeTruthy();

            });
        });

        test("or", () => {
            let expression = new Expr.Binary(
                new Expr.Literal(BrsBoolean.True, generateLocation(1)),
                token(Lexeme.Or),
                new Expr.Literal(BrsBoolean.True, generateLocation(2))
            );

            let fileCoverage = new FileCoverage("path/to/file");
            fileCoverage.evaluate(expression);
            fileCoverage.logHit(expression.left);
            fileCoverage.logHit(expression.left);

            let coverageResults = fileCoverage.getCoverage();
            expect(Object.keys(coverageResults.functions).length).toEqual(0);
            expect(Object.keys(coverageResults.statements).length).toEqual(0);

            let key = fileCoverage.getStatementKey(expression);
            let branch = coverageResults.branches[key];

            expect(branch.type).toEqual("Or");
            expect(branch.hits[0]).toEqual(2);
            expect(locationEqual(branch.locations[0], generateLocation(1))).toBeTruthy();
            expect(branch.hits[1]).toEqual(0);
            expect(locationEqual(branch.locations[1], generateLocation(2))).toBeTruthy();
        });
    });
});
