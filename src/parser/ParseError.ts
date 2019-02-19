import { Token, Lexeme } from "../lexer";
import { BrsError } from "../Error";

export class ParseError extends BrsError {
    constructor(token: Token, message: string) {
        let m = message;
        if (token.kind === Lexeme.Eof) {
            m = "(At end of file) " + message;
        }

        super(m, token.location);
    }
}
