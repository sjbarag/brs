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
                identifier("foo"),
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
                identifier("foo"),
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
                identifier("add2"),
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
                token(Lexeme.Function, "function"),
                identifier("repeat"),
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
                identifier("add"),
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
                token(Lexeme.Function, "function"),
                identifier("add"),
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
                token(Lexeme.Function, "function"),
                identifier("foo"),
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

        it('does not allow type designators at end of name', () => {
            const { tokens } = brs.lexer.Lexer.scan(`
                function StringFunc#()
                    return 1
                end function

                function IntegerFunc%()
                    return 1
                end function

                function FloatFunc!()
                    return 1
                end function

                function DoubleFunc#()
                    return 1
                end function
            `);
            const { statements, errors } = parser.parse(tokens);
            expect(errors.length).toEqual(4);
            expect(errors[0].location).toMatchObject({
                start: {
                    line: 2,
                    column: 25
                },
                end: {
                    line: 2,
                    column: 36
                }
            });
            expect(errors[1].location).toMatchObject({
                start: {
                    line: 6,
                    column: 25
                },
                end: {
                    line: 6,
                    column: 37
                }
            });
            expect(errors[2].location).toMatchObject({
                start: {
                    line: 10,
                    column: 25
                },
                end: {
                    line: 10,
                    column: 35
                }
            });
            expect(errors[3].location).toMatchObject({
                start: {
                    line: 14,
                    column: 25
                },
                end: {
                    line: 14,
                    column: 36
                }
            });
            expect(statements).toMatchSnapshot();
        });
    });

    describe("sub declarations", () => {
        it("parses minimal sub declarations", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Sub, "sub"),
                identifier("bar"),
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
                identifier("foo"),
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
                identifier("add2"),
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
                token(Lexeme.Function, "sub"),
                identifier("repeat"),
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
                token(Lexeme.Sub, "sub"),
                identifier("add"),
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
                token(Lexeme.Sub, "sub"),
                identifier("add"),
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
                token(Lexeme.Sub, "sub"),
                identifier("foo"),
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

        it('does not allow type designators at end of name', () => {
            const { tokens } = brs.lexer.Lexer.scan(`
                sub StringSub#()
                end sub

                sub IntegerSub%()
                end sub

                sub FloatSub!()
                end sub

                sub DoubleSub#()
                end sub
            `);
            const { statements, errors } = parser.parse(tokens);
            expect(errors.length).toEqual(4);
            expect(errors[0].location).toMatchObject({
                start: {
                    line: 2,
                    column: 20
                },
                end: {
                    line: 2,
                    column: 30
                }
            });
            expect(errors[1].location).toMatchObject({
                start: {
                    line: 5,
                    column: 20
                },
                end: {
                    line: 5,
                    column: 31
                }
            });
            expect(errors[2].location).toMatchObject({
                start: {
                    line: 8,
                    column: 20
                },
                end: {
                    line: 8,
                    column: 29
                }
            });
            expect(errors[3].location).toMatchObject({
                start: {
                    line: 11,
                    column: 20
                },
                end: {
                    line: 11,
                    column: 30
                }
            });
            expect(statements).toMatchSnapshot();
        });
    });
});
