const brs = require("brs");
const { Lexeme } = brs.lexer;
const { BrsString } = brs.types;

const { token, EOF } = require("../ParserTests");

describe("parser", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("print statements", () => {
        it("parses singular print statements", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Print),
                token(Lexeme.String, "Hello, world"),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses print lists with no separator", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Print),
                token(Lexeme.String, "Foo", new BrsString("Foo")),
                token(Lexeme.String, "bar", new BrsString("bar")),
                token(Lexeme.String, "baz", new BrsString("baz")),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });

        it("parses print lists with separators", () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.Print),
                token(Lexeme.String, "Foo", new BrsString("Foo")),
                token(Lexeme.Semicolon),
                token(Lexeme.String, "bar", new BrsString("bar")),
                token(Lexeme.Semicolon),
                token(Lexeme.String, "baz", new BrsString("baz")),
                EOF
            ]);

            expect(errors).toEqual([]);
            expect(statements).toBeDefined();
            expect(statements).not.toBeNull();
            expect(statements).toMatchSnapshot();
        });
    });
});
