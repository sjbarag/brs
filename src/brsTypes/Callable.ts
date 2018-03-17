import { Interpreter } from "../interpreter";
import { BrsType, BrsValue, ValueKind } from "./";

/** A `function` or `sub` (either "native" or implemented in BrightScript) that can be called in a BrightScript file. */
export interface Callable extends BrsValue {
    kind: ValueKind.Callable;

    /** The number of arguments expected by this function. */
    readonly arity: number;

    /**
     * Calls the function this `Callable` represents with the provided `arg`uments using the
     * provided `Interpreter` instance.
     *
     * @param interpret the interpreter to execute this callable in.
     * @param args the arguments to pass to the callable routine.
     *
     * @returns the return value of the function, or `invalid` if nothing is explicitly returned.
     */
    call(interpreter: Interpreter, args: BrsType[]): BrsType;
}
