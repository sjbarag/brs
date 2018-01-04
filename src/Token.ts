import { Lexeme } from "./Lexeme";
import Long = require("long");

export type Invalid = undefined;
export type Literal = string | number | Long | boolean | Invalid;

export interface Token {
    kind: Lexeme;
    text?: string;
    literal?: Literal;
    line: number;
}