const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { identifier, token } = require("../parser/ParserTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Executioner } = require("../../lib/visitor/Executioner");

let executioner;

describe("executioner", () => {
    beforeEach(() => {
        BrsError.reset();
        executioner = new Executioner();
    });

    it("returns 'invalid' for assignments", () => {
        let ast = new Stmt.Assignment(
            identifier("foo"),
            new Expr.Literal(5)
        );

        let result = executioner.exec([ast]);
        expect(result).toEqual([undefined]);
    });

    it("stores assigned values in global scope", () => {
        let ast = new Stmt.Assignment(
            identifier("bar"),
            new Expr.Literal(6)
        );
        executioner.exec([ast]);
        expect(
            executioner.environment.get(
                identifier("bar")
            )
        ).toBe(6);
    });

    it("retrieves variables from global scope", () => {
        let assign = new Stmt.Assignment(
            identifier("baz"),
            new Expr.Literal(7)
        );
        let retrieve = new Stmt.Expression(
            new Expr.Variable(
                identifier("baz")
            )
        );
        let results = executioner.exec([ assign, retrieve ]);
        expect(results).toEqual([undefined, 7]);
    });
});