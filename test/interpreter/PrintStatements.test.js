const BrsError = require("../../lib/Error");
const Expr = require("../../lib/parser/Expression");
const Stmt = require("../../lib/parser/Statement");
const { identifier, token } = require("../parser/ParserTests");
const { Lexeme } = require("../../lib/Lexeme");
const { Interpreter } = require("../../lib/interpreter");
const { Int32, BrsString, BrsInvalid } = require("../../lib/brsTypes");

const { createMockStreams, allArgs } = require("../e2e/E2ETests");

describe("interperter print statements", () => {
    let stdout, stderr, interpreter;

    beforeEach(() => {
        BrsError.reset();
        const outputStreams = createMockStreams();
        interpreter = new Interpreter(outputStreams);

        stdout = outputStreams.stdout;
        stderr = outputStreams.stderr;
    });

    it("prints single values on their own line", () => {
        const ast = new Stmt.Print([
            new Expr.Literal(new BrsString("foo"))
        ]);


        const [ result ] = interpreter.exec([ast]);
        expect(result.value).toEqual(BrsInvalid.Instance);
        expect(allArgs(stdout.write).join("")).toEqual(
            "foo\n"
        );
    });

    it("prints multiple values with no separators", () => {
        const ast = new Stmt.Print([
            new Expr.Literal(new BrsString("foo")),
            new Expr.Literal(new BrsString("bar")),
            new Expr.Literal(new BrsString("baz")),
        ]);

        const [ result ] = interpreter.exec([ast]);
        expect(result.value).toEqual(BrsInvalid.Instance);
        expect(allArgs(stdout.write).join("")).toEqual(
            "foobarbaz\n"
        );
    });

    it("prints multiple values with space separators", () => {
        const ast = new Stmt.Print([
            new Expr.Literal(new BrsString("foo")),
            Stmt.PrintSeparator.Space,
            new Expr.Literal(new BrsString("bar")),
            Stmt.PrintSeparator.Space,
            new Expr.Literal(new BrsString("baz")),

        ]);

        const [ result ] = interpreter.exec([ast]);
        expect(result.value).toEqual(BrsInvalid.Instance);
        expect(allArgs(stdout.write).join("")).toEqual(
            "foo bar baz\n"
        );
    });

    it("aligns values to 16-charcater tab stops", () => {
        const ast = new Stmt.Print([
            new Expr.Literal(new BrsString("foo")),
            Stmt.PrintSeparator.Tab,
            new Expr.Literal(new BrsString("barbara")),
            Stmt.PrintSeparator.Tab,
            new Expr.Literal(new BrsString("baz")),
        ]);

        const [ result ] = interpreter.exec([ast]);
        expect(result.value).toEqual(BrsInvalid.Instance);
        expect(allArgs(stdout.write).join("")).toEqual(
        //   0   0   0   1   1   2   2   2   3
        //   0   4   8   2   6   0   4   8   2
            "foo             barbara         baz\n"
        );
    });

    it("skips cursor-return with a trailing semicolon", () => {
        const ast = new Stmt.Print([
            new Expr.Literal(new BrsString("foo")),
            Stmt.PrintSeparator.Space,
            new Expr.Literal(new BrsString("bar")),
            Stmt.PrintSeparator.Space,
            new Expr.Literal(new BrsString("baz")),
            Stmt.PrintSeparator.Space,
        ]);

        const [ result ] = interpreter.exec([ast]);
        expect(result.value).toEqual(BrsInvalid.Instance);
        expect(allArgs(stdout.write).join("")).toEqual(
            "foo bar baz"
        );
    });
});
