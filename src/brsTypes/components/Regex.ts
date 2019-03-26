import { BrsBoolean, BrsInvalid, BrsString, BrsValue, ValueKind } from "../BrsType";
import { BrsComponent } from "./BrsComponent";
import { BrsType } from "..";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { BrsArray } from "./BrsArray";

export class Regex extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;
    readonly supportedFlags = "ims";
    private jsRegex : RegExp;

    constructor(expression: BrsString, flags = new BrsString("")) {
        super("roRegex");
        this.jsRegex = new RegExp(expression.value, this.parseFlags(flags.value));

        this.registerMethods([
            this.isMatch,
            this.match,
            this.replace,
            this.replaceAll,
            this.split,
            this.matchAll
        ]);
    }

    toString(parent?: BrsType): string {
        return "<Component: roRegex>";
    }

    private parseFlags(inputFlags: string): string {
        let parsedFlags = "";
        if (inputFlags.length === 0) {
            return parsedFlags;
        }

        for (const flag of inputFlags) {
            if (flag === "x") {
                console.warn("'x' flag is not implemented yet, ignoring flag.");
            } else if(this.supportedFlags.indexOf(flag) === -1) {
                throw new Error(`${flag} is not supported.`);
            } else {
                parsedFlags += flag;
            }
        }

        return parsedFlags;
    }

    private parseReplacementPattern(pattern: string): string {
        return pattern.replace(/\\/g, "\$");
    }

    private isMatch = new Callable(
        "ismatch",
        {
            signature: {
                args: [
                    new StdlibArgument("str", ValueKind.String)
                ],
                returns: ValueKind.Boolean
            },
            impl: (interpreter: Interpreter, str: BrsString) => {
                return this.jsRegex.test(str.value) ? BrsBoolean.True : BrsBoolean.False;
            }
        }
    );

    private match = new Callable(
        "match",
        {
            signature: {
                args: [
                    new StdlibArgument("str", ValueKind.String)
                ],
                returns: ValueKind.Object
            },
            impl: (interpreter: Interpreter, str: BrsString) => {
                const result = this.jsRegex.exec(str.value);
                let arr = [];
                if (result !== null) {
                    for (let i = 0; i < result.length; i++) {
                        let item = result[i] ? new BrsString(result[i]) : BrsInvalid.Instance;
                        arr.push(item);
                    }
                }

                return new BrsArray(arr);
            }
        }
    );

    private replace = new Callable(
        "replace",
        {
            signature: {
                args: [
                    new StdlibArgument("str", ValueKind.String),
                    new StdlibArgument("str", ValueKind.String)
                ],
                returns: ValueKind.String
            },
            impl: (interpreter: Interpreter, str: BrsString, replacement: BrsString) => {
                let replacementPattern = this.parseReplacementPattern(replacement.value);
                const newStr = this.jsRegex[Symbol.replace](str.value, replacementPattern);
                return new BrsString(newStr);
            }
        }
    );

    private replaceAll = new Callable(
        "replaceall",
        {
            signature: {
                args: [
                    new StdlibArgument("str", ValueKind.String),
                    new StdlibArgument("str", ValueKind.String)
                ],
                returns: ValueKind.String
            },
            impl: (interpreter: Interpreter, str: BrsString, replacement: BrsString) => {
                const source = this.jsRegex.source;
                const flags = this.jsRegex.flags + "g";
                this.jsRegex = new RegExp(source, flags);
                const newStr = this.jsRegex[Symbol.replace](str.value, replacement.value);

                return new BrsString(newStr);
            }
        }
    );

    private split = new Callable(
        "split",
        {
            signature: {
                args: [
                    new StdlibArgument("str", ValueKind.String)
                ],
                returns: ValueKind.Object
            },
            impl: (interpreter: Interpreter, str: BrsString) => {
                let items = this.jsRegex[Symbol.split](str.value);
                let brsItems = items.map( item => new BrsString(item));
                return new BrsArray(brsItems);
            }
        }
    );

    private matchAll = new Callable(
        "matchall",
        {
            signature: {
                args: [
                    new StdlibArgument("str", ValueKind.String)
                ],
                returns: ValueKind.Object
            },
            impl: (interpreter: Interpreter, str: BrsString) => {
                const source = this.jsRegex.source;
                const flags = this.jsRegex.flags + "g";
                this.jsRegex = new RegExp(source, flags);
                let arr = [];
                let matches:any;

                while ((matches = this.jsRegex.exec(str.value)) !== null) {
                    let item = matches[0] ? new BrsString(matches[0]) : BrsInvalid.Instance;
                    arr.push(new BrsArray([ item ]));
                }
                return new BrsArray(arr);
            }
        }
    );
}
