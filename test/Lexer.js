const { assert } = require("chai");
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
}); // lexer
