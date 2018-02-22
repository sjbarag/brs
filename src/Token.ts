import Long from "long";
import { Lexeme } from "./Lexeme";
import { BrsType } from "./brsTypes";

export interface Token {
    kind: Lexeme;
    text?: string;
    literal?: BrsType;
    line: number;
}
