const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsBoolean, Int32 } = brs.types;

const { token, identifier, EOF } = require("../ParserTests");

describe("parser array literals", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("empty arrays", () => {
        test("on one line", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("on multiple lines", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                { kind: Lexeme.Newline, text: "\n", line: 1 },
                { kind: Lexeme.Newline, text: "\n", line: 2 },
                { kind: Lexeme.Newline, text: "\n", line: 3 },
                { kind: Lexeme.Newline, text: "\n", line: 4 },
                { kind: Lexeme.Newline, text: "\n", line: 5 },
                { kind: Lexeme.Newline, text: "\n", line: 6 },
                { kind: Lexeme.RightSquare, text: "]", line: 7 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });

    describe("filled arrays", () => {
        test("on one line", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                token(Lexeme.Integer, "1", new Int32(1)),
                { kind: Lexeme.Comma, text: ",", line: 1 },
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.Comma, text: ",", line: 1 },
                token(Lexeme.Integer, "3", new Int32(3)),
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("on multiple lines with commas", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                { kind: Lexeme.Newline, text: "\n", line: 1 },
                token(Lexeme.Integer, "1", new Int32(1)),
                { kind: Lexeme.Comma, text: ",", line: 1 },
                { kind: Lexeme.Newline, text: "\n", line: 1 },
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.Comma, text: ",", line: 2 },
                { kind: Lexeme.Newline, text: "\n", line: 2 },
                token(Lexeme.Integer, "3", new Int32(3)),
                { kind: Lexeme.Newline, text: "\n", line: 3 },
                { kind: Lexeme.RightSquare, text: "]", line: 4 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        test("on multiple lines without commas", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                { kind: Lexeme.Newline, text: "\n", line: 1 },
                token(Lexeme.Integer, "1", new Int32(1)),
                { kind: Lexeme.Newline, text: "\n", line: 1 },
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.Newline, text: "\n", line: 2 },
                token(Lexeme.Integer, "3", new Int32(3)),
                { kind: Lexeme.Newline, text: "\n", line: 3 },
                { kind: Lexeme.RightSquare, text: "]", line: 4 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });

    describe("contents", () => {
        it("can contain primitives", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                token(Lexeme.Integer, "1", new Int32(1)),
                { kind: Lexeme.Comma, text: ",", line: 1 },
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.Comma, text: ",", line: 1 },
                token(Lexeme.Integer, "3", new Int32(3)),
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("can contain other arrays", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                    { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                    token(Lexeme.Integer, "1", new Int32(1)),
                    { kind: Lexeme.Comma, text: ",", line: 1 },
                    token(Lexeme.Integer, "2", new Int32(2)),
                    { kind: Lexeme.Comma, text: ",", line: 1 },
                    token(Lexeme.Integer, "3", new Int32(3)),
                    { kind: Lexeme.RightSquare, text: "]", line: 1 },
                { kind: Lexeme.Comma, text: ",", line: 1 },
                    { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                    token(Lexeme.Integer, "4", new Int32(4)),
                    { kind: Lexeme.Comma, text: ",", line: 1 },
                    token(Lexeme.Integer, "5", new Int32(5)),
                    { kind: Lexeme.Comma, text: ",", line: 1 },
                    token(Lexeme.Integer, "6", new Int32(6)),
                    { kind: Lexeme.RightSquare, text: "]", line: 1 },
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("can contain expressions", () => {
            let { statements, errors } = parser.parse([
                { kind: Lexeme.Identifier, text: "_", line: 1 },
                { kind: Lexeme.Equal, text: "=", line: 1 },
                { kind: Lexeme.LeftSquare, text: "[", line: 1 },
                token(Lexeme.Integer, "1", new Int32(1)),
                { kind: Lexeme.Plus, text: "+", line: 1},
                token(Lexeme.Integer, "2", new Int32(2)),
                { kind: Lexeme.Comma, text: ",", line: 1 },
                { kind: Lexeme.Not, text: "not", line: 1 },
                token(Lexeme.False, "false", BrsBoolean.False),
                { kind: Lexeme.RightSquare, text: "]", line: 1 },
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
