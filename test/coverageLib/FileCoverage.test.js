const path = require("path");

const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Expr, Stmt } = brs.parser;
const { Int32, BrsString, BrsBoolean } = brs.types;

const { FileCoverage } = require("../../lib/coverageLib/FileCoverage");

jest.mock("fast-glob");
jest.mock("fs");
const fg = require("fast-glob");
const fs = require("fs");
const realFs = jest.requireActual("fs");

// helper to allow easy location generation
function generateLocation(num) {
    return {
        start: { line: num, column: num },
        end: { line: num, column: num },
        file: "some/file",
    };
}

function token(kind, text, locationNum, literal) {
    return {
        kind: kind,
        text: text,
        isReserved: brs.lexer.ReservedWords.has((text || "").toLowerCase()),
        literal: literal,
        location: generateLocation(locationNum || -1),
    };
}

function identifier(value, locationNum = 1) {
    return token(Lexeme.Identifier, value, locationNum);
}

function locationEqual(loc1, loc2) {
    return (
        loc1.start.line === loc2.start.line &&
        loc1.start.column === loc2.start.column &&
        loc1.end.line === loc2.end.line &&
        loc1.end.column === loc2.end.column
    );
}

describe("FileCoverage", () => {
    beforeEach(() => {
        fg.sync.mockImplementation(() => {
            return [
                "baseComponent.xml",
                "extendedComponent.xml",
                "scripts/baseComp.brs",
                "scripts/extendedComp.brs",
                "scripts/utility.brs",
            ];
        });
        fs.readFile.mockImplementation((filename, _, cb) => {
            resourcePath = path.join(__dirname, "resources", filename);
            realFs.readFile(resourcePath, "utf8", (err, contents) => {
                cb(/* no error */ null, contents);
            });
        });
    });

    // describe("integration", () => {
    //     it("runs", () => {
    //         expect(true).toEqual(true);
    //     });
    // });

    // describe("getCoverage", () => {
    //     it("runs", () => {
    //         expect(true).toEqual(true);
    //     });
    // });

    describe("statements", () => {
        function checkSimpleStatement(statement, numHits = 1) {
            let fileCoverage = new FileCoverage("path/to/file");
            fileCoverage.execute(statement);

            let coverageResults = fileCoverage.getCoverage();
            expect(Object.keys(coverageResults.branches).length).toEqual(0);
            expect(Object.keys(coverageResults.functions).length).toEqual(0);

            let statementKeys = Object.keys(coverageResults.statements);
            expect(statementKeys.length).toEqual(1);

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

            it("else-ifs", () => {
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
        });
    });

    afterEach(() => {
        fg.sync.mockRestore();
        fs.readFile.mockRestore();
    });
});
