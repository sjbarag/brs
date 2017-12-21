export enum Lexeme {
    // parens (and friends)
    LeftParen,
    RightParen,
    LeftSquare,
    RightSquare,
    LeftBrace,
    RightBrace,

    // operators
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
    LessGreater, // BrightScript uses `<>` for "not equal"

    // literals
    Identifier,
    String,
    Number,

    // other single-character symbols
    Dot,
    Comma,
    Semicolon,

    // keywords
    // canonical source: https://sdkdocs.roku.com/display/sdkdoc/Reserved+Words
    And,
    Box,
    CreateObject,
    Dim,
    Each,
    Else,
    ElseIf,
    End,
    EndFunction,
    EndIf,
    EndSub,
    EndWhile,
    Eval,
    Exit,
    ExitWhile,
    False,
    For,
    Function,
    GetGlobalAA,
    GetLastRunCompileError,
    GetLastRunRunTimeError,
    Goto,
    If,
    Invalid,
    Let,
    LineNum,
    Next,
    Not,
    ObjFun,
    Or,
    Pos,
    Print,
    Rem,
    Return,
    Run,
    Step,
    Stop,
    Sub,
    Tab,
    Then,
    To,
    True,
    Type,
    While,

    // non-reserved but still meaningful
    As,

    // structural
    Newline,
    Eof
}