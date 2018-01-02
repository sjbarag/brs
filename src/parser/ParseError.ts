import { Token } from "../Token";
import * as OrbsError from "../Error";
import { Lexeme } from "../Lexeme";

export function make(token: Token, message: string) {
    let m = message;
    if (token.kind === Lexeme.Eof) {
        m = "(At end of file) " + message;
    }
    OrbsError.make(m, token.line);

    return new ParseError();
}

export class ParseError extends Error {}