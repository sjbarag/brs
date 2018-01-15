import { Token, Literal as TokenLiteral } from "../Token";
import { Lexeme } from "../Lexeme";
import * as BrsError from "../Error";

export default class Environment {
    private values = new Map<string, TokenLiteral>();

    public define(name: string, value: TokenLiteral): void {
        this.values.set(name, value);
    }

    public get(name: Token): TokenLiteral {
        if (this.values.has(name.text!)) {
            return this.values.get(name.text!);
        }

        throw BrsError.runtime(`Undefined variable ${name.text}`, name.line);
    }
}