const brs = require("brs");
const { Lexeme } = brs.lexer;
const { Chunk } = brs.preprocessor;
const { BrsString, BrsBoolean } = brs.types;

const { Preprocessor } = require("../../lib/preprocessor/Preprocessor");

/**
 * Convenience function that creates a `Location` object based on a startin and ending line and column.
 *
 * @example
 * location([1, 2], [3, 4]) === { start: { line: 1, column: 2 }, end: { line: 3, column: 4 } }
 */
function location([startLine, startCol], [endLine, endCol]) {
    return {
        start: { line: startLine, column: startCol },
        end: { line: endLine, column: endCol }
    }
}

describe("preprocessor", () => {
    it("forwards brightscript chunk contents unmodified", () => {
        let unprocessed = [
            { kind: Lexeme.Identifier, text: "foo", isReserved: false, location: location([1, 1], [1, 3]) },
            { kind: Lexeme.LeftParen, text: "(", isReserved: false, location: location([1, 4], [1, 4]) },
            { kind: Lexeme.RightParen, text: ")", isReserved: false, location: location([1, 5], [1, 5]) },
            { kind: Lexeme.Newline, text: "\n", isReserved: false, location: location([1, 6], [1, 6]) },
            { kind: Lexeme.Eof, text: "\0", isReserved: false, location: location([2, 1], [2, 1]) }
        ];

        let { processedTokens } = new Preprocessor().filter([
            new Chunk.BrightScript(unprocessed)
        ]);
        expect(processedTokens).toEqual(unprocessed);
    });

    describe("#const", () => {
        it("removes #const declarations from output", () => {
            let { processedTokens } = new Preprocessor().filter([
                new Chunk.Declaration(
                    { kind: Lexeme.Identifier, text: "lorem", isReserved: false, location: location([1, 8], [1, 12]) },
                    { kind: Lexeme.False, text: "false", literal: BrsBoolean.False, isReserved: true, location: location([1, 14], [1, 19]) }
                )
            ]);
            expect(processedTokens).toEqual([]);
        });

        describe("values", () => {
            it("allows `true`", () => {
                expect(() =>
                    new Preprocessor().filter([
                        new Chunk.Declaration(
                            { kind: Lexeme.Identifier, text: "lorem", isReserved: false, location: location([1, 8], [1, 12]) },
                            { kind: Lexeme.True, text: "true", literal: BrsBoolean.True, isReserved: true, location: location([1, 14], [1, 18]) }
                        )
                    ])
                ).not.toThrow();
            });

            it("allows `false`", () => {
                expect(() =>
                    new Preprocessor().filter([
                        new Chunk.Declaration(
                            { kind: Lexeme.Identifier, text: "ipsum", isReserved: false, location: location([1, 8], [1, 12]) },
                            { kind: Lexeme.False, text: "false", literal: BrsBoolean.False, isReserved: true, location: location([1, 14], [1, 18]) }
                        )
                    ])
                ).not.toThrow();
            });

            it("allows identifiers", () => {
                expect(() =>
                    new Preprocessor().filter([
                        // 'ipsum' must be defined before it's referenced
                        new Chunk.Declaration(
                            { kind: Lexeme.Identifier, text: "ipsum", isReserved: false, location: location([1, 8], [1, 12]) },
                            { kind: Lexeme.False, text: "false", literal: BrsBoolean.False, isReserved: true, location: location([1, 14], [1, 18]) }
                        ),
                        new Chunk.Declaration(
                            { kind: Lexeme.Identifier, text: "dolor", isReserved: false, location: location([2, 8], [2, 12]) },
                            { kind: Lexeme.Identifier, text: "ipsum", isReserved: false, location: location([1, 14], [1, 18]) }
                        )
                    ])
                ).not.toThrow();
            });

            it("disallows strings", () => {
                expect(() =>
                    new Preprocessor().filter([
                        new Chunk.Declaration(
                            { kind: Lexeme.Identifier, text: "sit", isReserved: false, location: location([1, 8], [1, 10]) },
                            { kind: Lexeme.String, text: "good boy!", literal: new BrsString("good boy!"), isReserved: false, location: location([1, 12], [1, 23]) }
                        )
                    ])
                ).toThrow("#const declarations can only have");
            });

            it("disallows re-declaration of values", () => {
                expect(() =>
                    new Preprocessor().filter([
                        new Chunk.Declaration(
                            { kind: Lexeme.Identifier, text: "lorem", isReserved: false, location: location([1, 8], [1, 12]) },
                            { kind: Lexeme.False, text: "false", literal: BrsBoolean.False, isReserved: true, location: location([1, 14], [1, 18]) }
                        ),
                        new Chunk.Declaration(
                            { kind: Lexeme.Identifier, text: "lorem", isReserved: false, location: location([2, 8], [2, 12]) },
                            { kind: Lexeme.True, text: "true", literal: BrsBoolean.True, isReserved: true, location: location([2, 14], [2, 17]) }
                        ),
                    ])
                ).toThrow("Attempting to re-declare");
            });
        });
    });

    describe("#error", () => {
        it("throws error when #error directives encountered", () => {
            expect(() =>
                new Preprocessor().filter([
                    new Chunk.Error(
                        { kind: Lexeme.HashError, text: "#error", isReserved: false, location: location([1, 1], [1, 6]) },
                        "I'm an error message!"
                    )
                ])
            ).toThrow();
        });

        it("doesn't throw when branched around", () => {
            expect(() =>
                new Preprocessor().filter([
                    new Chunk.If(
                        { kind: Lexeme.False, text: "false", literal: BrsBoolean.False, isReserved: true, location: location([1, 5], [1, 10]) },
                        [
                            new Chunk.Error(
                                { kind: Lexeme.HashError, text: "#error", isReserved: false, location: location([2, 1], [2, 6]) },
                                "I'm an error message!"
                            )
                        ],
                        [] // no else-ifs necessary
                    )
                ])
            ).not.toThrow();
        });
    });

    describe("#if", () => {
        let ifChunk, elseIfChunk, elseChunk;

        beforeEach(() => {
            ifChunk = new Chunk.BrightScript([]);
            elseIfChunk = new Chunk.BrightScript([]);
            elseChunk = new Chunk.BrightScript([]);

            jest.spyOn(ifChunk, "accept");
            jest.spyOn(elseIfChunk, "accept");
            jest.spyOn(elseChunk, "accept");
        })

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("enters #if branch", () => {
            new Preprocessor().filter([
                new Chunk.If(
                    { kind: Lexeme.True, text: "true", literal: BrsBoolean.True, line: 1, isReserved: true },
                    [ ifChunk ],
                    [
                        {
                            condition: { kind: Lexeme.True, text: "true", literal: BrsBoolean.True, line: 2, isReserved: true },
                            thenChunks: [ elseIfChunk ]
                        }
                    ],
                    [ elseChunk ]
                )
            ]);

            expect(ifChunk.accept).toHaveBeenCalledTimes(1);
            expect(elseIfChunk.accept).not.toHaveBeenCalled();
            expect(elseChunk.accept).not.toHaveBeenCalled();
        });

        it("enters #else if branch", () => {
            new Preprocessor().filter([
                new Chunk.If(
                    { kind: Lexeme.False, text: "false", literal: BrsBoolean.False, line: 1, isReserved: true },
                    [ ifChunk ],
                    [
                        {
                            condition: { kind: Lexeme.True, text: "true", literal: BrsBoolean.True, line: 2, isReserved: true },
                            thenChunks: [ elseIfChunk ]
                        }
                    ],
                    [ elseChunk ]
                )
            ]);

            expect(ifChunk.accept).not.toHaveBeenCalled();
            expect(elseIfChunk.accept).toHaveBeenCalledTimes(1);
            expect(elseChunk.accept).not.toHaveBeenCalled();
        });

        it("enters #else branch", () => {
            new Preprocessor().filter([
                new Chunk.If(
                    { kind: Lexeme.False, text: "false", literal: BrsBoolean.False, line: 1, isReserved: true },
                    [ ifChunk ],
                    [
                        {
                            condition: { kind: Lexeme.False, text: "false", literal: BrsBoolean.False, line: 1, isReserved: true },
                            thenChunks: [ elseIfChunk ]
                        }
                    ],
                    [ elseChunk ]
                )
            ]);

            expect(ifChunk.accept).not.toHaveBeenCalled();
            expect(elseIfChunk.accept).not.toHaveBeenCalled();
            expect(elseChunk.accept).toHaveBeenCalledTimes(1);
        });

        it("enters no branches if none pass", () => {
            new Preprocessor().filter([
                new Chunk.If(
                    { kind: Lexeme.False, text: "false", literal: BrsBoolean.False, line: 1, isReserved: true },
                    [ ifChunk ],
                    [ ] // no else-if chunks
                    // NOTE: no 'else" chunk!
                )
            ]);

            expect(ifChunk.accept).not.toHaveBeenCalled();
            expect(elseIfChunk.accept).not.toHaveBeenCalled();
            expect(elseChunk.accept).not.toHaveBeenCalled();
        });

        it("uses #const values to determine truth", () => {
            new Preprocessor().filter([
                new Chunk.Declaration(
                    { kind: Lexeme.Identifier, text: "lorem", line: 1, isReserved: false },
                    { kind: Lexeme.True, text: "True", literal: BrsBoolean.True, line: 1, isReserved: true }
                ),
                new Chunk.If(
                    { kind: Lexeme.Identifier, text: "lorem", line: 2, isReserved: false },
                    [ ifChunk ],
                    [ ] // no else-if chunks
                    // NOTE: no 'else" chunk!
                )
            ]);

            expect(ifChunk.accept).toHaveBeenCalledTimes(1);
            expect(elseIfChunk.accept).not.toHaveBeenCalled();
            expect(elseChunk.accept).not.toHaveBeenCalled();
        });
    });
});
