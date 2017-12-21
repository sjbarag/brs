export enum BrsLexeme {
    // parens (and friends)
    LeftParen,
    RightParen,
    LeftSquare,
    RightSquare,
    LeftBrace,
    RightBrace,

    // operators
    Dot,
    Caret,
    Minus,
    Plus,
    Star,
    Slash,
    Mod,
    Backslash,

    // bitshift
    LeftShift, // <<
    RightShift, // >>

    // comparators
    Less,
    LessEqual,
    Greater,
    GreaterEqual,
    Equal,
    LessGreater,

    // literals
    Identifier,
    String,
    Number,

    // keywords
    If,
    Then,
    ElseIf,
    Else,
    EndIf,

    For,
    ForEach,
    In,
    To,
    EndFor,
    Step,
    ExitFor,

    Not,
    And,
    Or,

    Function,
    Sub,

    Print,
    Return,

    Newline,
    Eof
}