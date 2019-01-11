import { BrsType, ValueKind, Callable, BrsString, BrsInvalid } from "../brsTypes";
import * as Expr from "../parser/Expression";
import { Interpreter } from "../interpreter";

export const Run = new Callable(
    "Run",
    {
        signature: {
            args: [
                {
                    name: "filename",
                    type: ValueKind.String
                },
                {
                    name: "arg1",
                    type: ValueKind.Dynamic,
                    defaultValue: new Expr.Literal(BrsInvalid.Instance)
                }
            ],
            returns: ValueKind.Dynamic
        },
        impl: (interpreter: Interpreter, filename: BrsString, ...args: BrsType[]) => {
            return BrsInvalid.Instance;
        }
    }
);
