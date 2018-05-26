const Parser = require("../../../lib/parser");
const { Lexeme } = require("../../../lib/Lexeme");
const BrsError = require("../../../lib/Error");

const { EOF } = require("../ParserTests");

describe("parser", () => {
    afterEach(() => BrsError.reset());

    describe("function declarations", () => {
        it("parses minimal empty function declarations", () => {
            let parsed = Parser.parse([
                { kind: Lexeme.Function, text: "function", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndFunction, text: "end function", line: 2 },
                EOF
            ]);

            expect(BrsError.found()).toBeFalsy();
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });

    describe("sub declarations", () => {
        it("parses minimal sub declarations", () => {
            let parsed = Parser.parse([
                { kind: Lexeme.Sub, text: "sub", line: 1 },
                { kind: Lexeme.Identifier, text: "bar", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndSub, text: "end sub", line: 2 },
                EOF
            ]);

            expect(BrsError.found()).toBeFalsy();
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });
});
