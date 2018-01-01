const { Lexeme } = require("../../lib/Lexeme");

exports.token = function(kind, literal) {
    return {
        kind: kind,
        literal: literal,
        line: 1
    };
}

exports.EOF = exports.token(Lexeme.Eof);