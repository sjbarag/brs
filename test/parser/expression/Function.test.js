const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsString, Int32 } = brs.types;
const { token, identifier, EOF } = require("../ParserTests");

describe("parser", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("function expressions", () => {
        it("parses minimal empty function expressions", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Function, "function"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Newline, "\n"),
                token(Lexeme.EndFunction, "end function"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses colon-separated function declarations", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Function, "function"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Colon, ":"),
                token(Lexeme.Print, "print"),
                token(Lexeme.String, "Lorem ipsum", new BrsString("Lorem ipsum")),
                token(Lexeme.Colon, ":"),
                token(Lexeme.EndFunction, "end function"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses non-empty function expressions", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Function, "function"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.Print, "print"),
                token(Lexeme.String, "Lorem ipsum", new BrsString("Lorem ipsum")),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndFunction, "end function"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses functions with implicit-dynamic arguments", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Function, "function"),
                token(Lexeme.LeftParen, "("),
                identifier("a"),
                token(Lexeme.Comma, ","),
                identifier("b"),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndFunction, "end function"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses functions with typed arguments", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Function, "function"),
                token(Lexeme.LeftParen, "("),
                identifier("str"),
                identifier("as"),
                identifier("string"),
                token(Lexeme.Comma, ","),
                identifier("count"),
                identifier("as"),
                identifier("integer"),
                token(Lexeme.Comma, ","),
                identifier("separator"),
                identifier("as"),
                identifier("object"),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndFunction, "end function"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses functions with default argument expressions", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Function, "function"),
                token(Lexeme.LeftParen, "("),

                identifier("a"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.Comma, ","),

                identifier("b"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "4", new Int32(4)),
                token(Lexeme.Comma, ","),

                identifier("c"),
                token(Lexeme.Equal, "="),
                identifier("a"),
                token(Lexeme.Plus, "+"),
                token(Lexeme.Integer, "5", new Int32(5)),
                token(Lexeme.RightParen, ")"),

                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndFunction, "end function"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses functions with typed arguments and default expressions", () => {
             let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Function, "function"),
                token(Lexeme.LeftParen, "("),

                identifier("a"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "3", new Int32(3)),
                identifier("as"),
                identifier("integer"),
                token(Lexeme.Comma, ","),

                identifier("b"),
                token(Lexeme.Equal, "="),
                identifier("a"),
                token(Lexeme.Plus, "+"),
                token(Lexeme.Integer, "5", new Int32(5)),
                identifier("as"),
                identifier("integer"),
                token(Lexeme.RightParen, ")"),

                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndFunction, "end function"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses return types", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Function, "function"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                identifier("as"),
                identifier("void"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndFunction, "end function"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });

    describe("sub expressions", () => {
        it("parses minimal sub expressions", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Sub, "sub"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndSub, "end sub"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses non-empty sub expressions", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Sub, "sub"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.Print, "print"),
                token(Lexeme.String, "Lorem ipsum", new BrsString("Lorem ipsum")),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndSub, "end sub"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses subs with implicit-dynamic arguments", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Function, "sub"),
                token(Lexeme.LeftParen, "("),
                identifier("a"),
                token(Lexeme.Comma, ","),
                identifier("b"),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndFunction, "end sub"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses subs with typed arguments", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Function, "sub"),
                token(Lexeme.LeftParen, "("),
                identifier("str"),
                identifier("as"),
                identifier("string"),
                token(Lexeme.Comma, ","),
                identifier("count"),
                identifier("as"),
                identifier("integer"),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndFunction, "end sub"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses subs with default argument expressions", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Sub, "sub"),
                token(Lexeme.LeftParen, "("),

                identifier("a"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.Comma, ","),

                identifier("b"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "4", new Int32(4)),
                token(Lexeme.Comma, ","),

                identifier("c"),
                token(Lexeme.Equal, "="),
                identifier("a"),
                token(Lexeme.Plus, "+"),
                token(Lexeme.Integer, "5", new Int32(5)),
                token(Lexeme.RightParen, ")"),

                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndSub, "end sub"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses subs with typed arguments and default expressions", () => {
             let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Sub, "sub"),
                token(Lexeme.LeftParen, "("),

                identifier("a"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "3", new Int32(3)),
                identifier("as"),
                identifier("integer"),
                token(Lexeme.Comma, ","),

                identifier("b"),
                token(Lexeme.Equal, "="),
                identifier("a"),
                token(Lexeme.Plus, "+"),
                token(Lexeme.Integer, "5", new Int32(5)),
                identifier("as"),
                identifier("integer"),
                token(Lexeme.RightParen, ")"),

                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndSub, "end sub"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("doesn't allow return types", () => {
            let { statements, errors } = parser.parse([
                identifier("_"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Sub, "sub"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                identifier("as"),
                identifier("integer"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndSub, "end sub"),
                EOF
            ]);

            expect(errors.length).not.toBe(0);
        });
    });

    describe("usage", () => {
        it("allows sub expressions in call arguments", () => {
            const { statements, errors } = parser.parse([
                identifier("acceptsCallback"),
                { kind: Lexeme.LeftParen,  text: "(", line: 1 },
                token(Lexeme.Newline, "\\n"),

                token(Lexeme.Function, "function"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.Print, "print"),
                token(Lexeme.String, "I'm a callback", new BrsString("I'm a callback")),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndFunction, "end function"),
                token(Lexeme.Newline, "\\n"),

                token(Lexeme.RightParen, ")"),
                EOF
            ]);

            expect(errors).toEqual([])
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("allows function expressions in assignment RHS", () => {
            const { statements, errors } = parser.parse([
                identifier("anonymousFunction"),
                token(Lexeme.Equal, "="),

                token(Lexeme.Function, "function"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.Print, "print"),
                token(Lexeme.String, "I'm anonymous", new BrsString("I'm anonymous")),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndFunction, "end function"),

                EOF
            ]);

            expect(errors).toEqual([])
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
