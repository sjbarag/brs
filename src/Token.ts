import { Lexeme } from "./Lexeme";
import Long = require("long");
import { BrsType } from "./brsTypes";

export interface Token {
    kind: Lexeme;
    text?: string;
    literal?: BrsType;
    line: number;
}