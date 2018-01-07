const Parser = require("../../../lib/parser");
const { Lexeme } = require("../../../lib/Lexeme");
const BrsError = require("../../../lib/Error");

const { token, EOF } = require("../ParserTests");

describe("parser", () => {
    afterEach(() => BrsError.reset());

    describe("relational expressions", () => {
        it("parses less-than expressions", () => {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 5),
                token(Lexeme.Less),
                token(Lexeme.Integer, 2),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses less-than-or-equal-to expressions", () => {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 5),
                token(Lexeme.LessEqual),
                token(Lexeme.Integer, 2),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses greater-than expressions", () => {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 5),
                token(Lexeme.Greater),
                token(Lexeme.Integer, 2),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses greater-than-or-equal-to expressions", () => {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 5),
                token(Lexeme.GreaterEqual),
                token(Lexeme.Integer, 2),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses equality expressions", () => {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 5),
                token(Lexeme.Equal),
                token(Lexeme.Integer, 2),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        it("parses inequality expressions", () => {
            let parsed = Parser.parse([
                token(Lexeme.Integer, 5),
                token(Lexeme.LessGreater),
                token(Lexeme.Integer, 2),
                EOF
            ]);
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });
});