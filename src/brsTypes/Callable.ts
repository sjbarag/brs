import { Interpreter } from "../interpreter";
import { BrsType, BrsValue, ValueKind } from "./";

export interface Callable extends BrsValue {
    kind: ValueKind.Callable;
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