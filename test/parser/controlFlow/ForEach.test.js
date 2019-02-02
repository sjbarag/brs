const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Expr, Stmt } = brs.parser;

const { EOF } = require("../ParserTests");

describe("parser foreach loops", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    it("requires a name and target", () => {
        let { statements, errors } = parser.parse([
            { kind: Lexeme.ForEach, text: "for each", line: 2 },
            { kind: Lexeme.Identifier, text: "word", line: 2 },
            { kind: Lexeme.Identifier, text: "in", line: 2 },
            { kind: Lexeme.Identifier, text: "lipsum", line: 2 },
            { kind: Lexeme.Newline, text: "\n", line: 2 },

            // body would go here, but it's not necessary for this test
            { kind: Lexeme.EndFor, text: "end for", line: 3 },
            { kind: Lexeme.Newline, text: "\n", line: 3 },
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();

        let forEach = statements[0];
        expect(forEach).toBeInstanceOf(Stmt.ForEach);

        expect(forEach.item).toEqual(
            { kind: Lexeme.Identifier, text: "word", line: 2 }
        );
        expect(forEach.target).toBeInstanceOf(Expr.Variable);
        expect(forEach.target.name).toEqual(
            { kind: Lexeme.Identifier, text: "lipsum", line: 2 }
        );

        expect(statements).toMatchSnapshot();
    });

    it("allows 'next' to terminate loop", () => {
        let { statements, errors } = parser.parse([
            { kind: Lexeme.ForEach, text: "for each", line: 2 },
            { kind: Lexeme.Identifier, text: "word", line: 2 },
            { kind: Lexeme.Identifier, text: "in", line: 2 },
            { kind: Lexeme.Identifier, text: "lipsum", line: 2 },
            { kind: Lexeme.Newline, text: "\n", line: 2 },

            // body would go here, but it's not necessary for this test
            { kind: Lexeme.Next, text: "next", line: 3 },
            { kind: Lexeme.Newline, text: "\n", line: 3 },
            EOF
        ]);

        expect(errors).toEqual([])
        expect(statements).toBeDefined();
        expect(errors).toEqual([]);
        expect(statements).toBeDefined();
        expect(statements).toMatchSnapshot();
    });
});
