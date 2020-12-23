import { Callable, ValueKind, BrsInvalid, RoAssociativeArray } from "../brsTypes";
import { Interpreter } from "../interpreter";

/**
 * Returns global M pointer (the m from the root Environment).
 */
export const GetGlobalAA = new Callable("GetGlobalAA", {
    signature: {
        args: [],
        returns: ValueKind.Dynamic,
    },
    impl: (interpreter: Interpreter): RoAssociativeArray => {
        return interpreter.environment.getRootM();
    },
});

export * from "./GlobalUtilities";
export * from "./CreateObject";
export * from "./File";
export * from "./Json";
export * from "./Localization";
export * from "./Math";
export * from "./Print";
export { Run } from "./Run";
export * from "./String";
export * from "./Type";
