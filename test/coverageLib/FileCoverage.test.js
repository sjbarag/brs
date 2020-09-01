const path = require("path");

const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Expr, Stmt } = brs.parser;
const { getComponentDefinitionMap } = require("../../lib/componentprocessor");
const { Interpreter, defaultExecutionOptions } = require("../../lib/interpreter");
const LexerParser = require("../../lib/LexerParser");
const { token, identifier: baseIdentifier } = require("../parser/ParserTests");
const { FileCoverage } = require("../../lib/coverageLib/FileCoverage");

jest.mock("fast-glob");
jest.mock("fs");
const fg = require("fast-glob");
const fs = require("fs");
const { Int32 } = require("../../lib/brsTypes/Int32");

const realFs = jest.requireActual("fs");

let defaultLocation = {
    start: { line: 1, column: 2 },
    end: { line: 3, column: 4 },
};

function identifier(value, location = defaultLocation) {
    let id = baseIdentifier(value);
    id.location = location;
    return id;
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
        function createCoverage(statement, numHits = 1) {
            let fileCoverage = new FileCoverage("path/to/file");
            fileCoverage.execute(statement);
            for (let i = 0; i < numHits; i++) {
                fileCoverage.logHit(statement);
            }

            return fileCoverage.getCoverage();
        }

        function checkStatement(statement, numHits = 1) {
            let coverageResults = createCoverage(statement, numHits);
            let statementKeys = Object.keys(coverageResults.statements);

            expect(statementKeys.length).toEqual(1);

            let statementCoverage = coverageResults.statements[statementKeys[0]];
            expect(locationEqual(statementCoverage.location, statement.location)).toBeTruthy();
            expect(statementCoverage.hits).toEqual(numHits);
        }

        describe("Correct number of hits", () => {
            it("0 hits", () => {
                checkStatement(new Stmt.Expression(new Expr.Literal(new Int32(1))), 0);
            });

            it("1 hit", () => {
                checkStatement(new Stmt.Expression(new Expr.Literal(new Int32(1))), 10);
            });

            it("10 hits", () => {
                checkStatement(new Stmt.Expression(new Expr.Literal(new Int32(1))), 10);
            });
        });

        it("Assignment", () => {
            checkStatement(
                new Stmt.Assignment(
                    { equals: token(Lexeme.Equal, "=") },
                    identifier("foo"),
                    new Expr.Literal(new Int32(1), defaultLocation)
                )
            );
        });

        it("Expression", () => {
            checkStatement(new Stmt.Expression(new Expr.Literal(new Int32(1))));
        });

        it("ExitFor", () => {
            checkStatement(new Stmt.ExitFor({ exitFor: token(Lexeme.ExitFor, "exit for") }));
        });

        it("ExitWhile", () => {
            checkStatement(new Stmt.ExitFor({ exitFor: token(Lexeme.ExitFor, "exit for") }));
        });
    });

    afterEach(() => {
        fg.sync.mockRestore();
        fs.readFile.mockRestore();
    });
});
