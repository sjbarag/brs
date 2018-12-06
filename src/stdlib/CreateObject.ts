import { Callable, ValueKind, BrsInvalid, BrsString } from "../brsTypes";
import { BrsObjects } from "../brsTypes/components/BrsObjects";
import { Interpreter } from "../interpreter";
import { createObjectBindingPattern } from "typescript";
import { AssociativeArray } from "../brsTypes/components/AssociativeArray";

export const CreateObject = new Callable(
    "CreateObject",
    {
        signature: {
            args: [{ name: "objName", type: ValueKind.String }],
            returns: ValueKind.Dynamic
        },
        impl: (interpreter: Interpreter, objName: BrsString) => {
            let ctor = BrsObjects.get(objName.value.toLowerCase());
            return ctor ? ctor() : BrsInvalid.Instance;
        }
    }
);
