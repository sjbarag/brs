const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsString, Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("function declarations", () => {
        it("parses minimal empty function declarations", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Function, "function"),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.LeftParen, "("),
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

        it("parses non-empty function declarations", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Function, "function"),
                token(Lexeme.Identifier, "foo"),
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
                token(Lexeme.Function, "function"),
                token(Lexeme.Identifier, "add2"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.Identifier, "a"),
                token(Lexeme.Comma, ","),
                token(Lexeme.Identifier, "b"),
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
                token(Lexeme.Function, "function"),
                token(Lexeme.Identifier, "repeat"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.Identifier, "str"),
                token(Lexeme.Identifier, "as"),
                token(Lexeme.Identifier, "string"),
                token(Lexeme.Comma, ","),
                token(Lexeme.Identifier, "count"),
                token(Lexeme.Identifier, "as"),
                token(Lexeme.Identifier, "integer"),
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
                token(Lexeme.Function, "function"),
                token(Lexeme.Identifier, "add"),
                token(Lexeme.LeftParen, "("),

                token(Lexeme.Identifier, "a"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.Comma, ","),

                token(Lexeme.Identifier, "b"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "4", new Int32(4)),
                token(Lexeme.Comma, ","),

                token(Lexeme.Identifier, "c"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Identifier, "a"),
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
                token(Lexeme.Function, "function"),
                token(Lexeme.Identifier, "add"),
                token(Lexeme.LeftParen, "("),

                token(Lexeme.Identifier, "a"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.Identifier, "as"),
                token(Lexeme.Identifier, "integer"),
                token(Lexeme.Comma, ","),

                token(Lexeme.Identifier, "b"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Identifier, "a"),
                token(Lexeme.Plus, "+"),
                token(Lexeme.Integer, "5", new Int32(5)),
                token(Lexeme.Identifier, "as"),
                token(Lexeme.Identifier, "integer"),
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
                token(Lexeme.Function, "function"),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Identifier, "as"),
                token(Lexeme.Identifier, "void"),
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

    describe("sub declarations", () => {
        it("parses minimal sub declarations", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Sub, "sub"),
                token(Lexeme.Identifier, "bar"),
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

        it("parses non-empty sub declarations", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Sub, "sub"),
                token(Lexeme.Identifier, "foo"),
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
                token(Lexeme.Function, "sub"),
                token(Lexeme.Identifier, "add2"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.Identifier, "a"),
                token(Lexeme.Comma, ","),
                token(Lexeme.Identifier, "b"),
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
                token(Lexeme.Function, "sub"),
                token(Lexeme.Identifier, "repeat"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.Identifier, "str"),
                token(Lexeme.Identifier, "as"),
                token(Lexeme.Identifier, "string"),
                token(Lexeme.Comma, ","),
                token(Lexeme.Identifier, "count"),
                token(Lexeme.Identifier, "as"),
                token(Lexeme.Identifier, "integer"),
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
                token(Lexeme.Sub, "sub"),
                token(Lexeme.Identifier, "add"),
                token(Lexeme.LeftParen, "("),

                token(Lexeme.Identifier, "a"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.Comma, ","),

                token(Lexeme.Identifier, "b"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "4", new Int32(4)),
                token(Lexeme.Comma, ","),

                token(Lexeme.Identifier, "c"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Identifier, "a"),
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
                token(Lexeme.Sub, "sub"),
                token(Lexeme.Identifier, "add"),
                token(Lexeme.LeftParen, "("),

                token(Lexeme.Identifier, "a"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Integer, "3", new Int32(3)),
                token(Lexeme.Identifier, "as"),
                token(Lexeme.Identifier, "integer"),
                token(Lexeme.Comma, ","),

                token(Lexeme.Identifier, "b"),
                token(Lexeme.Equal, "="),
                token(Lexeme.Identifier, "a"),
                token(Lexeme.Plus, "+"),
                token(Lexeme.Integer, "5", new Int32(5)),
                token(Lexeme.Identifier, "as"),
                token(Lexeme.Identifier, "integer"),
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
                token(Lexeme.Sub, "sub"),
                token(Lexeme.Identifier, "foo"),
                token(Lexeme.LeftParen, "("),
                token(Lexeme.RightParen, ")"),
                token(Lexeme.Identifier, "as"),
                token(Lexeme.Identifier, "integer"),
                token(Lexeme.Newline, "\\n"),
                token(Lexeme.EndSub, "end sub"),
                EOF
            ]);

            expect(errors.length).not.toBe(0);
        });
    });
});
