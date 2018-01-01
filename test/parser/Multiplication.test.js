const Parser = require("../../lib/parser");
const Expr = require("../../lib/parser/Expression");
const { Lexeme } = require("../../lib/Lexeme");
const OrbsError = require("../../lib/Error");

const { token, EOF } = require("./ParserTests");

describe("parser", () => {
    afterEach(() => OrbsError.reset());

    describe("multiplication expressions", () => {
        it("parses left-associative multiplication chains", () => {
            let parsed = Parser.parse([
                token(Lexeme.Float, Math.fround(3.0)),
                token(Lexeme.Star),
                token(Lexeme.Float, Math.fround(5.0)),
                token(Lexeme.Star),
                token(Lexeme.Float, Math.fround(7.0)),
                EOF
            ]);

            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses left-associative division chains", () => {
            let parsed = Parser.parse([
                token(Lexeme.Float, Math.fround(7.0)),
                token(Lexeme.Slash),
                token(Lexeme.Float, Math.fround(5.0)),
                token(Lexeme.Slash),
                token(Lexeme.Float, Math.fround(3.0)),
                EOF
            ]);

            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses left-associative modulo chains", () => {
            let parsed = Parser.parse([
                token(Lexeme.Float, Math.fround(7.0)),
                token(Lexeme.Mod),
                token(Lexeme.Float, Math.fround(9.0)),
                token(Lexeme.Mod),
                token(Lexeme.Float, Math.fround(3.0)),
                EOF
            ]);

            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses left-associative integer-division chains", () => {
            let parsed = Parser.parse([
                token(Lexeme.Float, Math.fround(32.5)),
                token(Lexeme.Backslash),
                token(Lexeme.Float, Math.fround(5.0)),
                token(Lexeme.Mod),
                token(Lexeme.Float, Math.fround(3.0)),
                EOF
            ]);

            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });
});