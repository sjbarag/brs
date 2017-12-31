const Int64 = require("node-int64");

const Lexer = require("../lib/Lexer");
const { Lexeme } = require("../lib/Lexeme");

describe("lexer", () => {
    test("includes an end-of-file marker", () => {
        let tokens = Lexer.scan("");
        assert.sameOrderedMembers(
            tokens.map(t => t.kind),
            [ Lexeme.Eof ],
            "All lexed strings must end with an EOF marker"
        );
    });

    test("ignores tabs and spaces", () => {
        let tokens = Lexer.scan("\t\t  \t     \t");
        assert.sameOrderedMembers(
            tokens.map(t => t.kind),
            [ Lexeme.Eof ],
            "Tabs and spaces produce no tokens"
        );
    });

    test("retains newlines", () => {
        let tokens = Lexer.scan("\n\n\n");
        assert.sameOrderedMembers(
            tokens.map(t => t.kind),
            [ Lexeme.Newline, Lexeme.Newline, Lexeme.Newline, Lexeme.Eof],
            "Newlines must produce tokens"
        )
    });

    describe("comments", () => { 
        test("ignores everything after `'`", () => {
            let tokens = Lexer.scan("= ' (");
            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [ Lexeme.Equal, Lexeme.Eof],
                "Tokens found after `'` must be ignored"
            );
        });

        test("ignores everything after `REM`", () => {
            let tokens = Lexer.scan("= REM (");
            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [ Lexeme.Equal, Lexeme.Eof],
                "Tokens found after `REM` must be ignored"
            );
        });

        test("ignores everything after `rem`", () => {
            let tokens = Lexer.scan("= rem (");
            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [ Lexeme.Equal, Lexeme.Eof],
                "Tokens found after `rem` must be ignored"
            );
        });
    }); // comments

    describe("non-literals", () => {
        test("reads parens & braces", () => {
            let tokens = Lexer.scan("(){}");

            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [
                    Lexeme.LeftParen,
                    Lexeme.RightParen,
                    Lexeme.LeftBrace,
                    Lexeme.RightBrace,
                    Lexeme.Eof
                ],
                "Should map each character to a lexeme"
            );
            assert.isEmpty(
                tokens.filter(t => !!t.literal),
                "Parens & braces should have no literal values"
            );
        });

        test("reads operators", () => {
            let tokens = Lexer.scan("^ - + * MOD / \\");

            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [
                    Lexeme.Caret,
                    Lexeme.Minus,
                    Lexeme.Plus,
                    Lexeme.Star,
                    Lexeme.Mod,
                    Lexeme.Slash,
                    Lexeme.Backslash,
                    Lexeme.Eof
                ],
                "Should map each operator to a lexeme"
            );
            assert.isEmpty(
                tokens.filter(t => !!t.literal),
                "Operators should have no literal values"
            );
        });

        test("reads bitshift operators", () => {
            let tokens = Lexer.scan("<< >> <<");
            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [
                    Lexeme.LeftShift,
                    Lexeme.RightShift,
                    Lexeme.LeftShift,
                    Lexeme.Eof
                ],
                "Should map each bitshift operator to a lexeme"
            );
            assert.isEmpty(
                tokens.filter(t => !!t.literal),
                "Bitshift operators should have no literal values"
            );
        });

        test("reads comparators", () => {
            let tokens = Lexer.scan("< <= > >= = <>");
            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [
                    Lexeme.Less,
                    Lexeme.LessEqual,
                    Lexeme.Greater,
                    Lexeme.GreaterEqual,
                    Lexeme.Equal,
                    Lexeme.LessGreater,
                    Lexeme.Eof
                ],
                "Should map each comparator to a lexeme"
            );
            assert.isEmpty(
                tokens.filter(t => !!t.literal),
                "Comparators should have no literal values"
            );
        });
    }); // non-literals

    describe("string literals", () => {
        test("stores produces string literal tokens", () => {
            let tokens = Lexer.scan(`"hello world"`);
            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [
                    Lexeme.String,
                    Lexeme.Eof
                ],
                "Should produce a string token"
            );
            assert.equal(
                tokens[0].literal,
                "hello world",
                "Should include string value in token"
            );
        });

        test(`escapes safely escapes " literals`, () => {
            let tokens = Lexer.scan(`"the cat says ""meow"""`);
            assert.equal(
                tokens[0].kind,
                Lexeme.String,
                "Should produce a string token"
            );
            assert.equal(
                tokens[0].literal,
                `the cat says "meow"`,
                `Should convert escaped double-quotes to "`
            );
        });

        test("produces an error for unterminated strings");
        test("disallows multiline strings");
    }); // string literals

    describe("double literals", () => {
        test("respects '#' suffix", () => {
            let d = Lexer.scan("123#")[0];
            assert.equal(d.kind, Lexeme.Double, "Should produce a double token");
            assert.equal(d.literal, 123, "Should contain a double-precision value");
        });

        test("forces literals >= 10 digits into doubles", () => {
            let d = Lexer.scan("0000000005")[0];
            assert.equal(d.kind, Lexeme.Double, "Should produce a double token");
            assert.equal(d.literal, 5, "Should contain a double-precision value");
        });

        test("forces literals with 'D' in exponent into doubles", () => {
            let d = Lexer.scan("2.5d3")[0];
            assert.equal(d.kind, Lexeme.Double, "Should produce a double token");
            assert.equal(d.literal, 2500, "Should contain a double-precision value");
        });
    });

    describe("float literals", () => {
        test("respects '!' suffix", () => {
            let f = Lexer.scan("0.00000008!")[0];
            assert.equal(f.kind, Lexeme.Float, "Should produce a float token");
            // Floating precision will make this *not* equal
            assert.notEqual(f.literal, 8e-8, "Should contain a single-precision value");
            assert.equal(f.literal, Math.fround(0.00000008), "Should contain a single-precision value");
        });

        test("forces literals with a decimal into floats", () => {
            let f = Lexer.scan("1.0")[0];
            assert.equal(f.kind, Lexeme.Float, "Should produce a float token");
            assert.equal(f.literal, Math.fround(1000000000000e-12), "Should contain a single-precision value");
        });

        test("forces literals with 'E' in exponent into floats", () => {
            let d = Lexer.scan("2.5e3")[0];
            assert.equal(d.kind, Lexeme.Float, "Should produce a float token");
            assert.equal(d.literal, 2500, "Should contain a single-precision value");
        });
    });

    describe("long integer literals", () => {
        test("supports hexadecimal literals");
        test("respects '&' suffix", () => {
            let li = Lexer.scan("123&")[0];
            assert.equal(li.kind, Lexeme.LongInteger, "Should produce a long integer token");
            assert.deepEqual(li.literal, new Int64("123"), "Should contain a long integer value");
        });
    });

    describe("integer literals", () => {
        test("supports hexadecimal literals");
        test("falls back to a regular integer", () => {
            let i = Lexer.scan("123")[0];
            assert.equal(i.kind, Lexeme.Integer, "Should produce an integer token");
            assert.isTrue(Number.isInteger(i.literal), "Should contain an integer value");
            assert.equal(i.literal, 123, "Should contain an integer value");
        });
    });

    describe("identifiers", () => {
        test("matches single-word reserved words", () => {
            // test just a sample of single-word reserved words for now.
            // if we find any that we've missed 
            let words = Lexer.scan("and or box if else endif return true false");
            assert.sameOrderedMembers(
                words.map(w => w.kind),
                [
                    Lexeme.And,
                    Lexeme.Or,
                    Lexeme.Box,
                    Lexeme.If,
                    Lexeme.Else,
                    Lexeme.EndIf,
                    Lexeme.Return,
                    Lexeme.True,
                    Lexeme.False,
                    Lexeme.Eof
                ],
                "Should map single-word reserved words to matching lexemes"
            );
            assert.isEmpty(
                words.filter(w => !!w.literal),
                "Reserved words should have no literal values"
            );
        });

        test("matches reserved words with silly capitalization", () => {
            let words = Lexer.scan("iF ELSE eNDIf FUncTioN");
            assert.sameOrderedMembers(
                words.map(w => w.kind),
                [
                    Lexeme.If,
                    Lexeme.Else,
                    Lexeme.EndIf,
                    Lexeme.Function,
                    Lexeme.Eof
                ],
                "Should map reserved words with silly capitaliation to matching lexemes"
            );
        });

        test("allows alpha-numeric (plus '_') identifiers", () => {
            let identifier = Lexer.scan("_abc_123_")[0];
            assert.equal(
                identifier.kind,
                Lexeme.Identifier,
                "Non-reserved words should map to Identifier lexemes"
            );
            assert.equal(
                identifier.text,
                "_abc_123_",
                "Non-reserved words should use their name as their text"
            );
        });
    });
}); // lexer
