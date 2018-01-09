const Parser = require("../../../lib/parser");
const { Lexeme } = require("../../../lib/Lexeme");
const BrsError = require("../../../lib/Error");

const { token, EOF } = require("../ParserTests");

describe("parser", () => {
    afterEach(() => BrsError.reset());

    describe("print statements", () => {
        it("parses print statements", () => {
            let parsed = Parser.parse([
                token(Lexeme.Print),
                token(Lexeme.String, "Hello, world"),
                EOF
            ]);

            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });
});