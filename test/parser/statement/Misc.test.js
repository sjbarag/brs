const brs = require("brs");

describe("parser", () => {
    let parser;

    beforeEach(() => {
        parser = new brs.parser.Parser();
    });

    describe("`end` keyword", () => {
        it('does not produce errors', () => {
            let { tokens } = brs.lexer.Lexer.scan(`
                sub Main()
                    end
                end sub
            `);
            let { statements, errors } = parser.parse(tokens);
            expect(errors.length).toEqual(0);
            expect(statements).toMatchSnapshot();
        });
        it('can be used as a property name on objects', () => {
            let { tokens } = brs.lexer.Lexer.scan(`
                sub Main()
                    person = {
                        end: true
                    }
                end sub
            `);
            let { statements, errors } = parser.parse(tokens);
            expect(errors.length).toEqual(0);
            expect(statements).toMatchSnapshot();
        });

        it('is not allowed as a standalone variable', () => {
            //this test depends on token locations, so use the lexer to generate those locations.
            let { tokens } = brs.lexer.Lexer.scan(`
                sub Main()
                    end = true
                end sub
            `);
            let { statements, errors } = parser.parse(tokens);
            expect(errors.length).toEqual(1);
            //specifically check for the error location, because the identifier location was wrong in the past
            expect(errors[0].location).toEqual({
                file: "",
                start: { line: 3, column: 20 },
                end: { line: 3, column: 23 }
            });
            expect(statements).toMatchSnapshot();
        });
    });

    it('certain reserved words are allowed as local var identifiers', () => {
        let { tokens } = brs.lexer.Lexer.scan(`
            sub Main()
                endfor = true
                double = true
                exitfor = true
                float = true
                foreach = true
                integer = true
                longinteger = true
                string = true
            end sub
        `);
        let { statements, errors } = parser.parse(tokens);
        expect(errors.length).toEqual(0);
        expect(statements).toMatchSnapshot();
    });

    it('most reserved words are not allowed as local var identifiers', () => {
        let statementList = [];
        for (var i = 0; i < brs.parser.Parser.disallowedIdentifiers; i++) {
            var identifier = brs.parser.Parser.disallowedIdentifiers[i];
            //use the lexer to generate tokens because there are many different Lexeme types represented in this list
            let { tokens } = brs.lexer.Lexer.scan(`
                sub main()
                    ${identifier} = true
                end sub
            `);
            let { statements, errors } = parser.parse(tokens);
            expect(errors.length).toBeGreaterThan(0);
            statementList.push(statements);
        }
        //a few additional keywords that we don't have lexemes for
        let { tokens } = brs.lexer.Lexer.scan(`
            sub main()
                boolean = true
                integer = true
                longinteger = true
                float = true
                double = true
                string = true
                object = true
                interface = true
            end sub
        `);
        let { statements, errors } = parser.parse(tokens);
        expect(errors.length).toEqual(0);
        expect(statementList).toMatchSnapshot();
    });

    it('allows whitelisted reserved words as object properties', () => {
        //use the lexer to generate token list because...this list is huge.
        let { tokens } = brs.lexer.Lexer.scan(`
            sub Main()
                person = {}
                person.and = true
                person.box = true
                person.createobject = true
                person.dim = true
                person.double = true
                person.each = true
                person.else = true
                person.elseif = true
                person.end = true
                person.endfor = true
                person.endfunction = true
                person.endif = true
                person.endsub = true
                person.endwhile = true
                person.eval = true
                person.exit = true
                person.exitfor = true
                person.exitwhile = true
                person.false = true
                person.float = true
                person.for = true
                person.foreach = true
                person.function = true
                person.getglobalaa = true
                person.getlastruncompileerror = true
                person.getlastrunruntimeerror = true
                person.goto = true
                person.if = true
                person.integer = true
                person.invalid = true
                person.let = true
                person.line_num = true
                person.longinteger = true
                person.next = true
                person.not = true
                person.objfun = true
                person.or = true
                person.pos = true
                person.print = true
                person.rem = true
                person.return = true
                person.run = true
                person.step = true
                person.stop = true
                person.string = true
                person.sub = true
                person.tab = true
                person.then = true
                person.to = true
                person.true = true
                person.type = true
                person.while = true
            end sub
        `);
        let { statements, errors } = parser.parse(tokens);
        expect(errors.length).toBe(0);
        expect(statements).toMatchSnapshot();
    });

    it('does not add extra quotes to AA keys', () => {
        let { tokens } = brs.lexer.Lexer.scan(`
            function main(arg as string)
                twoDimensional = {
                    "has-second-layer": true,
                    level: 1
                    secondLayer: {
                        level: 2
                    }
                }
            end function
        `);

        let { statements, errors } = brs.parser.Parser.parse(tokens);
        expect(statements[0].func.body.statements[0].value.elements[0].name.value).toEqual("has-second-layer");
    });
});
