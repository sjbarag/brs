const Parser = require("../../../lib/parser");
const Expr = require("../../../lib/parser/Expression");
const { Lexeme } = require("../../../lib/Lexeme");
const BrsError = require("../../../lib/Error");
const { BrsBoolean, Int32 } = require("../../../lib/brsTypes");

const { token, identifier, EOF } = require("../ParserTests");

describe("parser if statements", () => {
    afterEach(() => BrsError.reset());

    describe("single-line if", () => {
        it("parses if only", () => {
            let parsed = Parser.parse([
                token(Lexeme.If),
                token(Lexeme.Integer, new Int32(1)),
                token(Lexeme.Less),
                token(Lexeme.Integer, new Int32(2)),
                token(Lexeme.Then),
                identifier("foo"),
                token(Lexeme.Equal),
                token(Lexeme.True, BrsBoolean.True),
                token(Lexeme.Newline),
                EOF
            ]);


            expect(BrsError.found()).toBe(false);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses if-else", () => {
            let parsed = Parser.parse([
                token(Lexeme.If),
                token(Lexeme.Integer, new Int32(1)),
                token(Lexeme.Less),
                token(Lexeme.Integer, new Int32(2)),
                token(Lexeme.Then),
                identifier("foo"),
                token(Lexeme.Equal),
                token(Lexeme.True, BrsBoolean.True),
                token(Lexeme.Else),
                identifier("foo"),
                token(Lexeme.Equal),
                token(Lexeme.True, BrsBoolean.False),
                token(Lexeme.Newline),
                EOF
            ]);

            expect(BrsError.found()).toBe(false);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it.skip("parses if-elseif-else", () => {
            // TODO: Figure out if
            // ```
            //     if a < b then foo = a else if a = b then foo = invalid else foo = b`
            // ```
            // is legal on a Roku device.  Specifically, is `else if` allowed in the single-line
            // form of if/then?
            let parsed = Parser.parse([
                token(Lexeme.If),
                token(Lexeme.Integer, new Int32(1)),
                token(Lexeme.Less),
                token(Lexeme.Integer, new Int32(2)),
                token(Lexeme.Then),
                identifier("foo"),
                token(Lexeme.Equal),
                token(Lexeme.True, BrsBoolean.True),
                token(Lexeme.ElseIf),
                token(Lexeme.Integer, new Int32(1)),
                token(Lexeme.Equal),
                token(Lexeme.Integer, new Int32(2)),
                identifier("same"),
                token(Lexeme.Equal),
                token(Lexeme.True, BrsBoolean.True),
                token(Lexeme.Else),
                identifier("foo"),
                token(Lexeme.Equal),
                token(Lexeme.True, BrsBoolean.False),
                token(Lexeme.Newline),
                EOF
            ]);

            expect(BrsError.found()).toBe(false);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });
});