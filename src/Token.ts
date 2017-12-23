import { Lexeme } from "./Lexeme";
import Int64 = require("node-int64");

export type Invalid = undefined;
export type Literal = string | number | Int64 | boolean;

export interface Token {
    kind: Lexeme;
    text?: string;
    literal?: Literal;
    line: number;
}