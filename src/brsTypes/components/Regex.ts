import { BrsBoolean, BrsInvalid, BrsString, BrsValue, ValueKind } from "../BrsType";
import { BrsComponent } from "./BrsComponent";
import { BrsType } from "..";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { BrsArray } from "./BrsArray";

export class Regex extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;
    private jsRegex : RegExp;

    constructor(expression: BrsString, flags = new BrsString("")) {
        super("roRegex");
        this.jsRegex = new RegExp(expression.value, flags.value);

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
                args: [],
                returns: ValueKind.Boolean
            },
            impl: (interpreter: Interpreter, str: BrsString) => {
                return BrsBoolean.False;
            }
        }
    );

    private replaceAll = new Callable(
        "replaceall",
        {
            signature: {
                args: [],
                returns: ValueKind.Boolean
            },
            impl: (interpreter: Interpreter, str: BrsString) => {
                return BrsBoolean.False;
            }
        }
    );

    private split = new Callable(
        "split",
        {
            signature: {
                args: [],
                returns: ValueKind.Boolean
            },
            impl: (interpreter: Interpreter, str: BrsString) => {
                return BrsBoolean.False;
            }
        }
    );

    private matchAll = new Callable(
        "matchall",
        {
            signature: {
                args: [],
                returns: ValueKind.Boolean
            },
            impl: (interpreter: Interpreter, str: BrsString) => {
                return BrsBoolean.False;
            }
        }
    );
}
