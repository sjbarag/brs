const BrsError = require("../../../lib/Error");
const { Lexeme, BrsTypes, Parser } = require("brs");
const { Int32 } = BrsTypes;

const { EOF } = require("../ParserTests");

describe("parser indexing", () => {
    afterEach(() => BrsError.reset());

    describe("one level", () => {
        test("dotted", () => {
            let parsed = Parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.Dot, text: ".", line: 1 },
                { kind: Lexeme.Identifier, text: "bar", line: 1 },
                EOF
            ]);

            expect(BrsError.found()).toBeFalsy();
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        test("bracketed", () => {
            let parsed = Parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                { kind: Lexeme.Integer, text: "2", literal: new Int32(2), line: 1 },
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                EOF
            ]);

            expect(BrsError.found()).toBeFalsy();
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });

    describe("multi-level", () => {
        test("dotted", () => {
            let parsed = Parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.Dot, text: ".", line: 1 },
                { kind: Lexeme.Identifier, text: "bar", line: 1 },
                EOF
            ]);

            expect(BrsError.found()).toBeFalsy();
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        test("bracketed", () => {
            let parsed = Parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                { kind: Lexeme.Integer, text: "2", literal: new Int32(2), line: 1 },
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                { kind: Lexeme.Integer, text: "0", literal: new Int32(0), line: 1 },
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                { kind: Lexeme.Integer, text: "6", literal: new Int32(6), line: 1 },
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                EOF
            ]);

            expect(BrsError.found()).toBeFalsy();
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });

        test("mixed", () => {
            let parsed = Parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.Identifier, text: "foo", line: 1 },
                { kind: Lexeme.Dot, text: ".", line: 1 },
                { kind: Lexeme.Identifier, text: "bar", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                { kind: Lexeme.Integer, text: "0", literal: new Int32(0), line: 1 },
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                { kind: Lexeme.Dot, text: ".", line: 1 },
                { kind: Lexeme.Identifier, text: "baz", line: 1 },
                EOF
            ]);

            expect(BrsError.found()).toBeFalsy();
            expect(parsed).toBeDefined();
            expect(parsed).not.toBeNull();
            expect(parsed).toMatchSnapshot();
        });
    });
});
