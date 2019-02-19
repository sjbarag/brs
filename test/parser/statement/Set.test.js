const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");
describe("parser indexed assignment", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it("assigns to dotted index", () => {
        let { statements, errors } = parser.parse([
            { kind: Lexeme.Identifier, text: "foo", line: 1 },
            { kind: Lexeme.Dot, text: ".", line: 1 },
            { kind: Lexeme.Identifier, text: "bar", line: 1 },
            { kind: Lexeme.Equal, text: "=", line: 1 },
            { kind: Lexeme.Function, text: "function", line: 1 },
            { kind: Lexeme.LeftParen, text: "(", line: 1 },
            { kind: Lexeme.RightParen, text: ")", line: 1 },
            { kind: Lexeme.Newline, text: "\\n", line: 1 },
            { kind: Lexeme.EndFunction, text: "end function", line: 2 },
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });

    it("assigns to bracketed index", () => {
        let { statements, errors } = parser.parse([
            { kind: Lexeme.Identifier, text: "someArray", line: 1 },
            { kind: Lexeme.LeftSquare, text: "[", line: 1 },
            token(Lexeme.Integer, "0", new Int32(0)),
            { kind: Lexeme.RightSquare, text: "]", line: 1 },
            { kind: Lexeme.Equal, text: "=", line: 1 },
            { kind: Lexeme.Function, text: "function", line: 1 },
            { kind: Lexeme.LeftParen, text: "(", line: 1 },
            { kind: Lexeme.RightParen, text: ")", line: 1 },
            { kind: Lexeme.Newline, text: "\\n", line: 1 },
            { kind: Lexeme.EndFunction, text: "end function", line: 2 },
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(statements).not.toBeNull();
        expect(statements).toMatchSnapshot();
    });
});
