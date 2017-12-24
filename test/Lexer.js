const { assert } = require("chai");
const Int64 = require("node-int64");

const Lexer = require("../lib/Lexer");
const { Lexeme } = require("../lib/Lexeme");

describe("lexer", function() {
    it("includes an end-of-file marker", function(){
        let tokens = Lexer.scan("");
        assert.sameOrderedMembers(
            tokens.map(t => t.kind),
            [ Lexeme.Eof ],
            "All lexed strings must end with an EOF marker"
        );
    });

    it("ignores tabs and spaces", function() {
        let tokens = Lexer.scan("\t\t  \t     \t");
        assert.sameOrderedMembers(
            tokens.map(t => t.kind),
            [ Lexeme.Eof ],
            "Tabs and spaces produce no tokens"
        );
    });

    it("retains newlines", function() {
        let tokens = Lexer.scan("\n\n\n");
        assert.sameOrderedMembers(
            tokens.map(t => t.kind),
            [ Lexeme.Newline, Lexeme.Newline, Lexeme.Newline, Lexeme.Eof],
            "Newlines must produce tokens"
        )
    });

    context("comments", function(){ 
        it("ignores everything after `'`", function() {
            let tokens = Lexer.scan("= ' (");
            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [ Lexeme.Equal, Lexeme.Eof],
                "Tokens found after `'` must be ignored"
            );
        });

        it("ignores everything after `REM`", function() {
            let tokens = Lexer.scan("= REM (");
            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [ Lexeme.Equal, Lexeme.Eof],
                "Tokens found after `REM` must be ignored"
            );
        });

        it("ignores everything after `rem`", function() {
            let tokens = Lexer.scan("= rem (");
            assert.sameOrderedMembers(
                tokens.map(t => t.kind),
                [ Lexeme.Equal, Lexeme.Eof],
                "Tokens found after `rem` must be ignored"
            );
        });
    }); // comments

    context("non-literals", function() {
        it("reads parens & braces", function() {
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

        it("reads operators", function() {
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

        it("reads bitshift operators", function() {
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

        it("reads comparators", function() {
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

    context("string literals", function() {
        it("stores produces string literal tokens", function() {
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

        it(`escapes safely escapes " literals`, function(){
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

        it("produces an error for unterminated strings");
        it("disallows multiline strings");
    }); // string literals

    context("double literals", function() {
        it("respects '#' suffix", function() {
            let d = Lexer.scan("123#")[0];
            assert.equal(d.kind, Lexeme.Double, "Should produce a double token");
            assert.equal(d.literal, 123, "Should contain a double-precision value");
        });

        it("forces literals >= 10 digits into doubles", function() {
            let d = Lexer.scan("0000000005")[0];
            assert.equal(d.kind, Lexeme.Double, "Should produce a double token");
            assert.equal(d.literal, 5, "Should contain a double-precision value");
        });

        it("forces literals with 'D' in exponent into doubles", function() {
            let d = Lexer.scan("2.5d3")[0];
            assert.equal(d.kind, Lexeme.Double, "Should produce a double token");
            assert.equal(d.literal, 2500, "Should contain a double-precision value");
        });
    });

    context("float literals", function() {
        it("respects '!' suffix", function() {
            let f = Lexer.scan("0.00000008!")[0];
            assert.equal(f.kind, Lexeme.Float, "Should produce a float token");
            // Floating precision will make this *not* equal
            assert.notEqual(f.literal, 8e-8, "Should contain a single-precision value");
            assert.equal(f.literal, Math.fround(0.00000008), "Should contain a single-precision value");
        });

        it("forces literals with a decimal into floats", function() {
            let f = Lexer.scan("1.0")[0];
            assert.equal(f.kind, Lexeme.Float, "Should produce a float token");
            assert.equal(f.literal, Math.fround(1000000000000e-12), "Should contain a single-precision value");
        });

        it("forces literals with 'E' in exponent into floats", function() {
            let d = Lexer.scan("2.5e3")[0];
            assert.equal(d.kind, Lexeme.Float, "Should produce a float token");
            assert.equal(d.literal, 2500, "Should contain a single-precision value");
        });
    });

    context("long integer literals", function() {
        it("supports hexadecimal literals");
        it("respects '&' suffix", function() {
            let li = Lexer.scan("123&")[0];
            assert.equal(li.kind, Lexeme.LongInteger, "Should produce a long integer token");
            assert.deepEqual(li.literal, new Int64("123"), "Should contain a long integer value");
        });
    });

    context("integer literals", function() {
        it("supports hexadecimal literals");
        it("falls back to a regular integer", function() {
            let i = Lexer.scan("123")[0];
            assert.equal(i.kind, Lexeme.Integer, "Should produce an integer token");
            assert.isTrue(Number.isInteger(i.literal), "Should contain an integer value");
            assert.equal(i.literal, 123, "Should contain an integer value");
        });
    });

    context("identifiers", function() {
        it("matches single-word reserved words", function() {
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

        it("matches reserved words with silly capitalization", function() {
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

        it("matches multi-word reserved words", function() {
            let words = Lexer.scan("else if end function end if end sub end while exit while");
            assert.sameOrderedMembers(
                words.map(w => w.kind),
                [
                    Lexeme.ElseIf,
                    Lexeme.EndFunction,
                    Lexeme.EndIf,
                    Lexeme.EndSub,
                    Lexeme.EndWhile,
                    Lexeme.ExitWhile,
                    Lexeme.Eof
                ],
                "Should map spaced reserved words to matching single-word lexemes"
            );
        });

        it("allows alphanumeric non-reserved identifiers");
    });
}); // lexer
