import { isLong } from "./visitor/Executioner";
import { BrsType } from "./brsTypes";

export function stringify(value: BrsType) {
    return value.toString();
}