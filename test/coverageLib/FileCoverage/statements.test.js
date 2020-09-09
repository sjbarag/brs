const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Expr, Stmt } = brs.parser;
const { Int32, BrsString, BrsBoolean, ValueKind } = brs.types;

const { FileCoverage } = require("../../../lib/coverageLib/FileCoverage");
const { generateLocation, token, identifier, locationEqual } = require("./utils");

describe("FileCoverage statements", () => {
    function checkSimpleStatement(statement, numHits = 1, expectedNumStatements = 1) {
        let fileCoverage = new FileCoverage("path/to/file");
        fileCoverage.execute(statement);

        for (let i = 0; i < numHits; i++) {
            fileCoverage.logHit(statement);
        }

        let coverageResults = fileCoverage.getCoverage();
        expect(Object.keys(coverageResults.branches).length).toEqual(0);
        expect(Object.keys(coverageResults.functions).length).toEqual(0);

        let statementKeys = Object.keys(coverageResults.statements);
        expect(statementKeys.length).toEqual(expectedNumStatements);

        let statementCoverage = coverageResults.statements[statementKeys[0]];
        expect(locationEqual(statementCoverage.location, statement.location)).toBeTruthy();
        expect(statementCoverage.hits).toEqual(numHits);
    }

    describe("Correct number of hits", () => {
        it("0 hits", () => {
            checkSimpleStatement(new Stmt.Expression(new Expr.Literal(new Int32(1))), 0);
        });

        it("1 hit", () => {
            checkSimpleStatement(new Stmt.Expression(new Expr.Literal(new Int32(1))), 10);
        });

        it("10 hits", () => {
            checkSimpleStatement(new Stmt.Expression(new Expr.Literal(new Int32(1))), 10);
        });
    });

    it("Assignment", () => {
        checkSimpleStatement(
            new Stmt.Assignment(
                { equals: token(Lexeme.Equal, "=") },
                identifier("foo"),
                new Expr.Literal(new Int32(1), generateLocation(1))
            )
        );
    });

    it("Expression", () => {
        checkSimpleStatement(new Stmt.Expression(new Expr.Literal(new Int32(1))));
    });

    it("ExitFor", () => {
        checkSimpleStatement(new Stmt.ExitFor({ exitFor: token(Lexeme.ExitFor, "exit for") }));
    });

    it("ExitWhile", () => {
        checkSimpleStatement(
            new Stmt.ExitWhile({ exitWhile: token(Lexeme.ExitWhile, "exit while") })
        );
    });

    it("Print", () => {
        checkSimpleStatement(
            new Stmt.Print(
                {
                    print: token(Lexeme.Print, "print"),
                },
                [new Expr.Literal(new BrsString("foo")), new Expr.Literal(new Int32(1))]
            )
        );
    });

    it("Print", () => {
        checkSimpleStatement(
            new Stmt.Print(
                {
                    print: token(Lexeme.Print, "print"),
                },
                [new Expr.Literal(new BrsString("foo")), new Expr.Literal(new Int32(1))]
            )
        );
    });

    describe("If", () => {
        let assignTo;

        beforeEach(() => {
            let equals = { equals: token(Lexeme.Equals, "=") };
            assignTo = {
                foo: new Stmt.Assignment(
                    equals,
                    identifier("foo", 10),
                    new Expr.Literal(BrsBoolean.True)
                ),
                bar: new Stmt.Assignment(
                    equals,
                    identifier("bar", 11),
                    new Expr.Literal(BrsBoolean.False)
                ),
            };
        });

        it("no else-if or else branches", () => {
            let block = new Stmt.Block([assignTo.foo, assignTo.bar], generateLocation(1));
            let statement = new Stmt.If(
                {
                    if: token(Lexeme.If, "if", 2),
                    then: identifier("then", 3),
                    endIf: token(Lexeme.EndIf, "end if", 4),
                },
                new Expr.Binary(
                    new Expr.Literal(new Int32(1)),
                    token(Lexeme.Less),
                    new Expr.Literal(new Int32(2))
                ),
                block,
                []
            );

            let fileCoverage = new FileCoverage("path/to/file");
            fileCoverage.execute(statement);
            fileCoverage.logHit(statement);

            let coverageResults = fileCoverage.getCoverage();
            expect(Object.keys(coverageResults.functions).length).toEqual(0);
            expect(Object.keys(coverageResults.statements).length).toEqual(3);

            let ifKey = fileCoverage.getStatementKey(statement);
            let ifCoverage = coverageResults.branches[ifKey];

            // we only have one branch, so the array should only have one item
            expect(ifCoverage.locations.length).toEqual(1);
            expect(ifCoverage.hits.length).toEqual(1);
            expect(ifCoverage.hits[0]).toEqual(1);

            let blockKey = fileCoverage.getStatementKey(block);
            let blockCoverage = coverageResults.statements[blockKey];
            expect(blockCoverage.hits).toEqual(0);
        });

        it("else-if branches", () => {
            let ifBlock = new Stmt.Block([], generateLocation(1));
            let elseIfBlocks = [
                new Stmt.Block([], generateLocation(2)),
                new Stmt.Block([], generateLocation(3)),
            ];
            let statement = new Stmt.If(
                {
                    if: token(Lexeme.If, "if", 2),
                    then: identifier("then", 3),
                    endIf: token(Lexeme.EndIf, "end if", 4),
                },
                new Expr.Binary(
                    new Expr.Literal(new Int32(1)),
                    token(Lexeme.Less, "", 5),
                    new Expr.Literal(new Int32(2))
                ),
                ifBlock,
                [
                    {
                        condition: new Expr.Literal(BrsBoolean.True),
                        thenBranch: elseIfBlocks[0],
                        type: "else if",
                    },
                    {
                        condition: new Expr.Literal(BrsBoolean.True),
                        thenBranch: elseIfBlocks[1],
                        type: "else if",
                    },
                ]
            );

            let fileCoverage = new FileCoverage("path/to/file");
            fileCoverage.execute(statement);
            fileCoverage.logHit(statement);
            elseIfBlocks.forEach((block) => {
                fileCoverage.logHit(block);
            });

            let coverageResults = fileCoverage.getCoverage();
            expect(Object.keys(coverageResults.functions).length).toEqual(0);
            expect(Object.keys(coverageResults.statements).length).toEqual(3);

            elseIfBlocks.forEach((block) => {
                let blockKey = fileCoverage.getStatementKey(block);
                let blockCoverage = coverageResults.statements[blockKey];
                expect(blockCoverage.hits).toEqual(1);
            });
        });

        it("else branch", () => {
            let ifBlock = new Stmt.Block([], generateLocation(1));
            let elseBlock = new Stmt.Block([assignTo.foo], generateLocation(2));
            let statement = new Stmt.If(
                {
                    if: token(Lexeme.If, "if", 2),
                    then: identifier("then", 3),
                    endIf: token(Lexeme.EndIf, "end if", 4),
                },
                new Expr.Binary(
                    new Expr.Literal(new Int32(1)),
                    token(Lexeme.Less),
                    new Expr.Literal(new Int32(2))
                ),
                ifBlock,
                [],
                elseBlock
            );

            let fileCoverage = new FileCoverage("path/to/file");
            fileCoverage.execute(statement);
            fileCoverage.logHit(elseBlock);

            let coverageResults = fileCoverage.getCoverage();
            expect(Object.keys(coverageResults.functions).length).toEqual(0);
            expect(Object.keys(coverageResults.statements).length).toEqual(3);

            let elseKey = fileCoverage.getStatementKey(elseBlock);
            let elseCoverage = coverageResults.statements[elseKey];
            expect(elseCoverage.hits).toEqual(1);
        });
    });

    it("Block", () => {
        let equals = { equals: token(Lexeme.Equals, "=") };
        let statement = new Stmt.Block(
            [
                new Stmt.Assignment(
                    equals,
                    identifier("foo", 10),
                    new Expr.Literal(BrsBoolean.True)
                ),
                new Stmt.Assignment(
                    equals,
                    identifier("bar", 11),
                    new Expr.Literal(BrsBoolean.False)
                ),
            ],
            generateLocation(2)
        );

        let fileCoverage = new FileCoverage("path/to/file");
        fileCoverage.execute(statement);
        fileCoverage.logHit(statement);

        let coverageResults = fileCoverage.getCoverage();
        expect(Object.keys(coverageResults.functions).length).toEqual(0);
        expect(Object.keys(coverageResults.statements).length).toEqual(3);

        let key = fileCoverage.getStatementKey(statement);
        expect(coverageResults.statements[key].hits).toEqual(1);
    });

    it("For", () => {
        checkSimpleStatement(
            new Stmt.For(
                {
                    for: token(Lexeme.For, "for"),
                    to: token(Lexeme.To, "to"),
                    endFor: token(Lexeme.EndFor, "end for"),
                },
                new Stmt.Assignment(
                    { equals: token(Lexeme.Equals, "=") },
                    identifier("i"),
                    new Expr.Literal(new Int32(0))
                ),
                /* final value */ new Expr.Literal(new Int32(5)),
                /* step */ new Expr.Literal(new Int32(1)),
                /* body */ new Stmt.Block([], generateLocation(1))
            ),
            /* number of hits */ 1,
            /* expected number of statements (For, Assignment, Block) */ 3
        );
    });

    it("ForEach", () => {
        checkSimpleStatement(
            new Stmt.ForEach(
                {
                    forEach: token(Lexeme.ForEach, "for each"),
                    in: token(Lexeme.In, "in"),
                    endFor: token(Lexeme.EndFor, "end for"),
                },
                identifier("element"),
                /* target */ new Expr.Variable(identifier("array")),
                /* body */ new Stmt.Block([], generateLocation(1))
            ),
            /* number of hits */ 1,
            /* expected number of statements (ForEach, Block) */ 2
        );
    });

    it("While", () => {
        checkSimpleStatement(
            new Stmt.While(
                {
                    while: token(Lexeme.While, "while"),
                    endWhile: token(Lexeme.EndWhile, "end while"),
                },
                new Expr.Binary(
                    new Expr.Variable(identifier("foo")),
                    token(Lexeme.Greater, ">"),
                    new Expr.Literal(new Int32(0))
                ),
                new Stmt.Block([], generateLocation(1))
            ),
            /* number of hits */ 1,
            /* expected number of statements (While, Block) */ 2
        );
    });

    it("Function", () => {
        let statement = new Stmt.Function(
            identifier("foo"),
            new Expr.Function(
                [],
                ValueKind.Void,
                new Stmt.Block([], generateLocation(1)),
                token(Lexeme.Function, "function"),
                token(Lexeme.EndFunction, "end function")
            )
        );

        let fileCoverage = new FileCoverage("path/to/file");
        fileCoverage.execute(statement);
        fileCoverage.logHit(statement.func);

        let coverageResults = fileCoverage.getCoverage();
        expect(Object.keys(coverageResults.statements).length).toEqual(1); // Block

        let statementKeys = Object.keys(coverageResults.functions);
        expect(statementKeys.length).toEqual(1);

        let statementCoverage = coverageResults.functions[statementKeys[0]];
        expect(locationEqual(statementCoverage.location, statement.location)).toBeTruthy();
        expect(statementCoverage.hits).toEqual(1);
    });

    it("Return", () => {
        checkSimpleStatement(
            new Stmt.Return(
                { return: token(Lexeme.Return, "return") },
                new Expr.Literal(new BrsString("hello, world"))
            )
        );
    });

    it("DottedSet", () => {
        checkSimpleStatement(
            new Stmt.DottedSet(
                new Expr.Variable(identifier("aa")),
                identifier("foo"),
                new Expr.Literal(new BrsString("new foo"), generateLocation(1))
            )
        );
    });

    it("IndexedSet", () => {
        checkSimpleStatement(
            new Stmt.IndexedSet(
                new Expr.Variable(identifier("aa")),
                new Expr.Literal(new BrsString("bar"), generateLocation(1)),
                new Expr.Literal(new BrsString("added bar"), generateLocation(2)),
                token(Lexeme.RightBrace, "}")
            )
        );
    });

    it("Increment", () => {
        checkSimpleStatement(
            new Stmt.Increment(
                new Expr.Variable(identifier("foo")),
                token(Lexeme.MinusMinus, "--")
            )
        );
    });

    it("Increment", () => {
        checkSimpleStatement(
            new Stmt.Increment(
                new Expr.Variable(identifier("foo")),
                token(Lexeme.MinusMinus, "--")
            )
        );
    });
});
