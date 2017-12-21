export enum Lexeme {
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

    // structural
    Newline,
    Eof
}