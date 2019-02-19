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
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Function, text: "function", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\n", line: 1 },
                { kind: Lexeme.EndFunction, text: "end function", line: 2 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses colon-separated function declarations", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Function, text: "function", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Colon, text: ":", line: 1 },
                { kind: Lexeme.Print, text: "print", line: 2 },
                token(Lexeme.String, "Lorem ipsum", new BrsString("Lorem ipsum")),
                { kind: Lexeme.Colon, text: ":", line: 2 },
                { kind: Lexeme.EndFunction, text: "end function", line: 3 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses non-empty function expressions", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Function, text: "function", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.Print, text: "print", line: 2 },
                token(Lexeme.String, "Lorem ipsum", new BrsString("Lorem ipsum")),
                { kind: Lexeme.Newline, text: "\\n", line: 2 },
                { kind: Lexeme.EndFunction, text: "end function", line: 3 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses functions with implicit-dynamic arguments", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Function, text: "function", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.Identifier, text: "a", line: 1 },
                { kind: Lexeme.Comma, text: ",", line: 1 },
                { kind: Lexeme.Identifier, text: "b", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndFunction, text: "end function", line: 2 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses functions with typed arguments", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Function, text: "function", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.Identifier, text: "str", line: 1 },
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "string", line: 1 },
                { kind: Lexeme.Comma, text: ",", line: 1 },
                { kind: Lexeme.Identifier, text: "count", line: 1 },
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "integer", line: 1 },
                { kind: Lexeme.Comma, text: ",", line: 1 },
                { kind: Lexeme.Identifier, text: "separator", line: 1 },
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "object", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndFunction, text: "end function", line: 2 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses functions with default argument expressions", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Function, text: "function", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },

                { kind: Lexeme.Identifier, text: "a", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Integer, "3", new Int32(3)),
                { kind: Lexeme.Comma, text: ",", line: 1 },

                { kind: Lexeme.Identifier, text: "b", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Integer, "4", new Int32(4)),
                { kind: Lexeme.Comma, text: ",", line: 1 },

                { kind: Lexeme.Identifier, text: "c", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "a", line: 1 },
                { kind: Lexeme.Plus, text: "+", line: 1 },
                token(Lexeme.Integer, "5", new Int32(5)),
                { kind: Lexeme.RightParen, text: ")", line: 1 },

                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndFunction, text: "end function", line: 2 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses functions with typed arguments and default expressions", () => {
             let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Function, text: "function", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },

                { kind: Lexeme.Identifier, text: "a", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Integer, "3", new Int32(3)),
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "integer", line: 1 },
                { kind: Lexeme.Comma, text: ",", line: 1 },

                { kind: Lexeme.Identifier, text: "b", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "a", line: 1 },
                { kind: Lexeme.Plus, text: "+", line: 1 },
                token(Lexeme.Integer, "5", new Int32(5)),
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "integer", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },

                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndFunction, text: "end function", line: 2 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses return types", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Function, text: "function", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "void", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndFunction, text: "end function", line: 2 },
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
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Sub, text: "sub", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndSub, text: "end sub", line: 2 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses non-empty sub expressions", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Sub, text: "sub", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.Print, text: "print", line: 2 },
                token(Lexeme.String, "Lorem ipsum", new BrsString("Lorem ipsum")),
                { kind: Lexeme.Newline, text: "\\n", line: 2 },
                { kind: Lexeme.EndSub, text: "end sub", line: 3 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses subs with implicit-dynamic arguments", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Function, text: "sub", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.Identifier, text: "a", line: 1 },
                { kind: Lexeme.Comma, text: ",", line: 1 },
                { kind: Lexeme.Identifier, text: "b", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndFunction, text: "end sub", line: 2 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses subs with typed arguments", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Function, text: "sub", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.Identifier, text: "str", line: 1 },
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "string", line: 1 },
                { kind: Lexeme.Comma, text: ",", line: 1 },
                { kind: Lexeme.Identifier, text: "count", line: 1 },
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "integer", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndFunction, text: "end sub", line: 2 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses subs with default argument expressions", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Sub, text: "sub", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },

                { kind: Lexeme.Identifier, text: "a", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Integer, "3", new Int32(3)),
                { kind: Lexeme.Comma, text: ",", line: 1 },

                { kind: Lexeme.Identifier, text: "b", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Integer, "4", new Int32(4)),
                { kind: Lexeme.Comma, text: ",", line: 1 },

                { kind: Lexeme.Identifier, text: "c", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "a", line: 1 },
                { kind: Lexeme.Plus, text: "+", line: 1 },
                token(Lexeme.Integer, "5", new Int32(5)),
                { kind: Lexeme.RightParen, text: ")", line: 1 },

                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndSub, text: "end sub", line: 2 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses subs with typed arguments and default expressions", () => {
             let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Sub, text: "sub", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },

                { kind: Lexeme.Identifier, text: "a", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                token(Lexeme.Integer, "3", new Int32(3)),
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "integer", line: 1 },
                { kind: Lexeme.Comma, text: ",", line: 1 },

                { kind: Lexeme.Identifier, text: "b", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "a", line: 1 },
                { kind: Lexeme.Plus, text: "+", line: 1 },
                token(Lexeme.Integer, "5", new Int32(5)),
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "integer", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },

                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndSub, text: "end sub", line: 2 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("doesn't allow return types", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Sub, text: "sub", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Identifier, text: "as", line: 1 },
                { kind: Lexeme.Identifier, text: "integer", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.EndSub, text: "end sub", line: 2 },
                EOF
            ]);

            expect(errors.length).not.toBe(0);
        });
    });

    describe("usage", () => {
        it("allows sub expressions in call arguments", () => {
            const { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "acceptsCallback", line: 1 },
                { kind: Lexeme.LeftParen,  text: "(", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },

                { kind: Lexeme.Function, text: "function", line: 2 },
                { kind: Lexeme.LeftParen, text: "(", line: 2 },
                { kind: Lexeme.RightParen, text: ")", line: 2 },
                { kind: Lexeme.Newline, text: "\\n", line: 2 },
                { kind: Lexeme.Print, text: "print", line: 3 },
                token(Lexeme.String, "I'm a callback", new BrsString("I'm a callback")),
                { kind: Lexeme.Newline, text: "\\n", line: 3 },
                { kind: Lexeme.EndFunction, text: "end function", line: 4 },
                { kind: Lexeme.Newline, text: "\\n", line: 4 },

                { kind: Lexeme.RightParen, text: ")", line: 5 },
                EOF
            ]);

            expect(errors).toEqual([])
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("allows function expressions in assignment RHS", () => {
            const { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "anonymousFunction", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },

                { kind: Lexeme.Function, text: "function", line: 1 },
                { kind: Lexeme.LeftParen, text: "(", line: 1 },
                { kind: Lexeme.RightParen, text: ")", line: 1 },
                { kind: Lexeme.Newline, text: "\\n", line: 1 },
                { kind: Lexeme.Print, text: "print", line: 2 },
                token(Lexeme.String, "I'm anonymous", new BrsString("I'm anonymous")),
                { kind: Lexeme.Newline, text: "\\n", line: 2 },
                { kind: Lexeme.EndFunction, text: "end function", line: 3 },

                EOF
            ]);

            expect(errors).toEqual([])
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
