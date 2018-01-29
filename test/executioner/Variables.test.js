const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { identifier, token } = require("../parser/ParserTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Executioner } = require("../../lib/visitor/Executioner");
const { Int32, BrsString, BrsInvalid } = require("../../lib/brsTypes");

let executioner;

describe("executioner variables", () => {
    beforeEach(() => {
        BrsError.reset();
        executioner = new Executioner();
    });

    it("returns 'invalid' for assignments", () => {
        let ast = new Stmt.Assignment(
            identifier("foo"),
            new Expr.Literal(new Int32(5))
        );

        let [result] = executioner.exec([ast]);
        expect(result).toEqual(BrsInvalid.Instance);
    });

    it("stores assigned values in global scope", () => {
        let six = new Int32(6)
        let ast = new Stmt.Assignment(
            identifier("bar"),
            new Expr.Literal(six)
        );
        executioner.exec([ast]);
        expect(
            executioner.environment.get(
                identifier("bar")
            )
        ).toBe(six);
    });

    it("retrieves variables from global scope", () => {
        let seven = new Int32(7);
        let assign = new Stmt.Assignment(
            identifier("baz"),
            new Expr.Literal(seven)
        );
        let retrieve = new Stmt.Expression(
            new Expr.Variable(
                identifier("baz")
            )
        );
        let results = executioner.exec([ assign, retrieve ]);
        expect(results).toEqual([BrsInvalid.Instance, seven]);
    });
});