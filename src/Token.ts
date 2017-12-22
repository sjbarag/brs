import { Lexeme } from "./Lexeme";

export type invalid = undefined;

export interface Token {
    kind: Lexeme;
    text?: string;
    literal?: string | Number | true | false;
    line: number;
}