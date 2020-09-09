const brs = require("brs");

/** Generates a location with the given line/column number */
exports.generateLocation = function(num) {
    return {
        start: { line: num, column: num },
        end: { line: num, column: num },
        file: "some/file",
    };
}

/** Generates a token */
exports.token = function(kind, text, locationNum, literal) {
    return {
        kind: kind,
        text: text,
        isReserved: brs.lexer.ReservedWords.has((text || "").toLowerCase()),
        literal: literal,
        location: exports.generateLocation(locationNum || -1),
    };
}

/** Generates an identifier token */
exports.identifier = function(value, locationNum = 1) {
    return exports.token(brs.lexer.Lexeme.Identifier, value, locationNum);
}

/** Checks if two location objects are equal */
exports.locationEqual = function(loc1, loc2) {
    return (
        loc1.start.line === loc2.start.line &&
        loc1.start.column === loc2.start.column &&
        loc1.end.line === loc2.end.line &&
        loc1.end.column === loc2.end.column
    );
}
