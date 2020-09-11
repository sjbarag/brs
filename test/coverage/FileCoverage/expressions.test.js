const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Expr, Stmt } = brs.parser;
const { Int32, BrsBoolean, BrsString, ValueKind } = brs.types;

const { FileCoverage } = require("../../../lib/coverage/FileCoverage");
const {
    generateLocation,
    token,
    identifier,
    locationEqual,
    fakeLocation,
} = require("../../parser/ParserTests");

const LEFT_SQUARE = token(Lexeme.LeftSquare, "[");
const RIGHT_SQUARE = token(Lexeme.RightSquare, "]");
const LEFT_BRACE = token(Lexeme.LeftBrace, "{");
const RIGHT_BRACE = token(Lexeme.RightBrace, "}");
const LEFT_PAREN = token(Lexeme.LeftParen, "(");
const RIGHT_PAREN = token(Lexeme.RightParen, ")");

describe("FileCoverage expressions", () => {
    function checkSimpleExpression(
        expression,
        expectedNumInternalStatements = 1, // number of private "statements" in FileCoverage class
        expectedNumCoverageStatements = 0 // number of "statements" in public coverage report
    ) {
        let fileCoverage = new FileCoverage("path/to/file");
        fileCoverage.execute(expression);
        expect(fileCoverage.statements.size).toEqual(expectedNumInternalStatements);

        fileCoverage.logHit(expression);

        let key = fileCoverage.getStatementKey(expression);
        expect(fileCoverage.statements.get(key).hits).toEqual(1);

        let coverageResults = fileCoverage.getCoverage();
        expect(Object.keys(coverageResults.branchMap).length).toEqual(0);
        expect(Object.keys(coverageResults.b).length).toEqual(0);
        expect(Object.keys(coverageResults.fnMap).length).toEqual(0);
        expect(Object.keys(coverageResults.f).length).toEqual(0);
        expect(Object.keys(coverageResults.statementMap).length).toEqual(
            expectedNumCoverageStatements
        );
        expect(Object.keys(coverageResults.s).length).toEqual(expectedNumCoverageStatements);
    }

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

            expect(Object.keys(coverageResults.fnMap).length).toEqual(0);
            expect(Object.keys(coverageResults.f).length).toEqual(0);
            expect(Object.keys(coverageResults.statementMap).length).toEqual(0);
            expect(Object.keys(coverageResults.s).length).toEqual(0);

            // less than is not a branch, so don't count it
            expect(Object.keys(coverageResults.branchMap).length).toEqual(0);
            expect(Object.keys(coverageResults.b).length).toEqual(0);
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
                fileCoverage.logHit(expression);
                fileCoverage.logHit(expression.left);

                let coverageResults = fileCoverage.getCoverage();
                expect(Object.keys(coverageResults.fnMap).length).toEqual(0);
                expect(Object.keys(coverageResults.f).length).toEqual(0);

                let key = fileCoverage.getStatementKey(expression);
                let branchStatement = coverageResults.statementMap[key];
                let branchStatementHits = coverageResults.s[key];

                // a branch is still a statement
                expect(Object.keys(coverageResults.statementMap).length).toEqual(1);
                expect(Object.keys(coverageResults.s).length).toEqual(1);
                expect(locationEqual(branchStatement, expression.location)).toBeTruthy();
                expect(branchStatementHits).toEqual(1);

                let branch = coverageResults.branchMap[key];
                let branchHits = coverageResults.b[key];

                expect(branch.type).toEqual("And");
                expect(branchHits[0]).toEqual(1);
                expect(locationEqual(branch.locations[0], generateLocation(1))).toBeTruthy();
                expect(branchHits[1]).toEqual(0);
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
                fileCoverage.logHit(expression);
                fileCoverage.logHit(expression.left);
                fileCoverage.logHit(expression.right);

                let coverageResults = fileCoverage.getCoverage();
                expect(Object.keys(coverageResults.fnMap).length).toEqual(0);
                expect(Object.keys(coverageResults.f).length).toEqual(0);

                let key = fileCoverage.getStatementKey(expression);
                let branchStatement = coverageResults.statementMap[key];
                let branchStatementHits = coverageResults.s[key];

                // a branch is still a statement
                expect(Object.keys(coverageResults.statementMap).length).toEqual(1);
                expect(Object.keys(coverageResults.s).length).toEqual(1);
                expect(locationEqual(branchStatement, expression.location)).toBeTruthy();
                expect(branchStatementHits).toEqual(1);

                let branch = coverageResults.branchMap[key];
                let branchHits = coverageResults.b[key];

                expect(branch.type).toEqual("And");
                expect(branchHits[0]).toEqual(1);
                expect(locationEqual(branch.locations[0], generateLocation(1))).toBeTruthy();
                expect(branchHits[1]).toEqual(1);
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
            fileCoverage.logHit(expression);
            fileCoverage.logHit(expression.left);
            fileCoverage.logHit(expression);
            fileCoverage.logHit(expression.left);

            let coverageResults = fileCoverage.getCoverage();
            expect(Object.keys(coverageResults.fnMap).length).toEqual(0);
            expect(Object.keys(coverageResults.f).length).toEqual(0);

            let key = fileCoverage.getStatementKey(expression);
            let branchStatement = coverageResults.statementMap[key];
            let branchStatementHits = coverageResults.s[key];

            // a branch is still a statement
            expect(Object.keys(coverageResults.statementMap).length).toEqual(1);
            expect(Object.keys(coverageResults.s).length).toEqual(1);
            expect(locationEqual(branchStatement, expression.location)).toBeTruthy();
            expect(branchStatementHits).toEqual(2);

            let branch = coverageResults.branchMap[key];
            let branchHits = coverageResults.b[key];

            expect(branch.type).toEqual("Or");
            expect(branchHits[0]).toEqual(2);
            expect(locationEqual(branch.locations[0], generateLocation(1))).toBeTruthy();
            expect(branchHits[1]).toEqual(0);
            expect(locationEqual(branch.locations[1], generateLocation(2))).toBeTruthy();
        });
    });

    test("Call", () => {
        checkSimpleExpression(
            new Expr.Call(new Expr.Variable(identifier("UCase")), RIGHT_PAREN, [
                new Expr.Literal(new BrsString("h@lL0"), fakeLocation),
            ]),
            /* expected number of internal statements (Call, Variable, Literal) */ 3
        );
    });

    test("Function", () => {
        let expression = new Expr.Function(
            [],
            ValueKind.Void,
            new Stmt.Block([], generateLocation(1)),
            token(Lexeme.Function, "function"),
            token(Lexeme.EndFunction, "end function")
        );

        let fileCoverage = new FileCoverage("path/to/file");
        fileCoverage.execute(expression);
        expect(fileCoverage.statements.size).toEqual(2); // Function, Block

        fileCoverage.logHit(expression);

        let key = fileCoverage.getStatementKey(expression);
        expect(fileCoverage.statements.get(key).hits).toEqual(1);

        let coverageResults = fileCoverage.getCoverage();
        expect(Object.keys(coverageResults.branchMap).length).toEqual(0);
        expect(Object.keys(coverageResults.b).length).toEqual(0);
        expect(Object.keys(coverageResults.fnMap).length).toEqual(1);
        expect(Object.keys(coverageResults.f).length).toEqual(1);
        expect(Object.keys(coverageResults.statementMap).length).toEqual(0);
        expect(Object.keys(coverageResults.s).length).toEqual(0);
    });

    test("DottedGet", () => {
        checkSimpleExpression(
            new Expr.DottedGet(new Expr.Variable(identifier("foo")), identifier("setMId")),
            /* expected number of internal statements (DottedGet, Variable) */ 2
        );
    });

    test("IndexedGet", () => {
        checkSimpleExpression(
            new Expr.IndexedGet(
                new Expr.Variable(identifier("array")),
                new Expr.Literal(new Int32(4), fakeLocation),
                RIGHT_SQUARE
            ),
            /* expected number of internal statements (IndexedGet, Variable, Literal) */ 3
        );
    });

    test("Grouping", () => {
        checkSimpleExpression(
            new Expr.Grouping(
                {
                    left: LEFT_PAREN,
                    right: RIGHT_PAREN,
                },
                new Expr.Binary(
                    new Expr.Literal(new Int32(6), generateLocation(1)),
                    token(Lexeme.Plus),
                    new Expr.Literal(new Int32(5), generateLocation(2))
                )
            ),
            /* expected number of internal statements (Grouping, Binary, 2 Literals) */ 4
        );
    });

    test("Literal", () => {
        checkSimpleExpression(new Expr.Literal(new Int32(5)));
    });

    test("ArrayLiteral", () => {
        checkSimpleExpression(
            new Expr.ArrayLiteral(
                [
                    new Expr.Literal(new BrsString("index0"), generateLocation(1)),
                    new Expr.Literal(new BrsString("index1"), generateLocation(2)),
                    new Expr.Literal(new BrsString("index2"), generateLocation(3)),
                ],
                LEFT_SQUARE,
                RIGHT_SQUARE
            ),
            /* expected number of internal statements (ArrayLiteral, 3 Literals) */ 4
        );
    });

    test("AALiteral", () => {
        checkSimpleExpression(
            new Expr.AALiteral(
                [{ name: new BrsString("foo"), value: new Expr.Literal(new Int32(7)) }],
                LEFT_BRACE,
                RIGHT_BRACE
            ),
            /* expected number of internal statements (AALiteral, Literal) */ 2
        );
    });

    test("Unary", () => {
        checkSimpleExpression(
            new Expr.Unary(token(Lexeme.Minus), new Expr.Literal(new BrsString("four"))),
            /* expected number of internal statements (Unary, Literal) */ 2
        );
    });

    test("Variable", () => {
        checkSimpleExpression(
            new Expr.Variable(identifier("array")),
            /* expected number of internal statements (Unary, Literal) */ 1
        );
    });
});
