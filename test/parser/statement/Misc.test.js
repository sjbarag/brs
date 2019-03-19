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
            let { tokens } = brs.lexer.Lexer.scan(`
                sub Main()
                    end = true
                end sub
            `);
            let { statements, errors } = parser.parse(tokens);
            expect(errors.length).toEqual(1);
            expect(errors[0].location.start.line).toEqual(3)
            //TODO - re-enable this test once the `end` identifier location bug is fixed
            // //specifically check for the error location, because the identifier location was wrong in the past
            // expect(errors[0].location).toEqual({
            //     start: { line: 3, column: 20 },
            //     end: { line: 3, column: 23 }
            // });
            expect(statements).toMatchSnapshot();
        });
    });
});