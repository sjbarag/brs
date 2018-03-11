import { Token } from "../Token";
import { Lexeme } from "../Lexeme";
import { BrsType } from "../brsTypes";
import * as BrsError from "../Error";

export default class Environment {
    private values = new Map<string, BrsType>();

    public define(name: string, value: BrsType): void {
        this.values.set(name, value);
    }

    public remove(name: string): void {
        this.values.delete(name);
    }

    public get(name: Token): BrsType {
        if (this.values.has(name.text!)) {
            return this.values.get(name.text!)!;
        }

        throw BrsError.runtime(`Undefined variable '${name.text}'`, name.line);
    }
}