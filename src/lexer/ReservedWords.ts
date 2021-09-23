import { Lexeme as L } from "./Lexeme";

/**
 * The set of all reserved words in the reference BrightScript runtime. These can't be used for any
 * other purpose (e.g. as identifiers) within a BrightScript file.
 * @see https://sdkdocs.roku.com/display/sdkdoc/Reserved+Words
 */
export const ReservedWords = new Set([
    "and",
    "box",
    "createobject",
    "dim",
    "each",
    "else",
    "elseif",
    "endsub",
    "endwhile",
    "eval",
    "exit",
    "exitwhile",
    "false",
    "for",
    "function",
    "getglobalaa",
    "getlastruncompileerror",
    "getlastrunruntimeerror",
    "goto",
    "if",
    "invalid",
    "let",
    "line_num",
    "next",
    "not",
    "objfun",
    "or",
    "pos",
    "print",
    "rem",
    "return",
    "run",
    "step",
    "stop",
    "sub",
    "tab",
    "then",
    "to",
    "throw",
    "true",
    "type",
    "while",
]);

/**
 * The set of keywords in the reference BrightScript runtime. Any of these that *are not* reserved
 * words can be used within a BrightScript file for other purposes as identifiers, e.g. `tab`.
 *
 * Unfortunately there's no canonical source for this!
 */
export const KeyWords: { [key: string]: L } = {
    and: L.And,
    catch: L.Catch,
    dim: L.Dim,
    else: L.Else,
    elseif: L.ElseIf,
    "else if": L.ElseIf,
    endfor: L.EndFor,
    "end for": L.EndFor,
    endfunction: L.EndFunction,
    "end function": L.EndFunction,
    endif: L.EndIf,
    "end if": L.EndIf,
    endsub: L.EndSub,
    "end sub": L.EndSub,
    endtry: L.EndTry,
    "end try": L.EndTry, // note: 'endtry' (no space) is *not* a keyword
    endwhile: L.EndWhile,
    "end while": L.EndWhile,
    exit: L.Exit,
    "exit for": L.ExitFor, // note: 'exitfor' (no space) is *not* a keyword
    exitwhile: L.ExitWhile,
    "exit while": L.ExitWhile,
    false: L.False,
    for: L.For,
    "for each": L.ForEach, // note: 'foreach' (no space) is *not* a keyword
    function: L.Function,
    goto: L.Goto,
    if: L.If,
    invalid: L.Invalid,
    let: L.Let,
    mod: L.Mod,
    next: L.Next,
    not: L.Not,
    or: L.Or,
    print: L.Print,
    rem: L.Rem,
    return: L.Return,
    step: L.Step,
    stop: L.Stop,
    sub: L.Sub,
    to: L.To,
    try: L.Try,
    throw: L.Throw,
    true: L.True,
    while: L.While,
};
