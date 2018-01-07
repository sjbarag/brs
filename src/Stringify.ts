import { isLong } from "./visitor/Executioner";
import { Literal as TokenLiteral } from "./Token";

export function stringify(value: TokenLiteral) {
    if (value === undefined) {
        return "invalid";
    } else if (isLong(value)) {
        return value.toString();
    } else {
        return JSON.stringify(value);
    }
}