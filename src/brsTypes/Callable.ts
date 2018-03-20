import { Interpreter } from "../interpreter";
import { BrsType, BrsValue, ValueKind, BrsBoolean } from "./";

/** A `function` or `sub` (either "native" or implemented in BrightScript) that can be called in a BrightScript file. */
export abstract class Callable implements BrsValue {
    readonly kind = ValueKind.Callable;

    /** The number of arguments expected by this function. */
    abstract readonly arity: {
        /**
         * The minimum number of arguments required for this function call. Is equal to `arity.max`
         * when all arguments are required.
         */
        required: number;

        /** The number of optional arguments accepted by this function. */
        optional: number;
    };

    /**
     * Calls the function this `Callable` represents with the provided `arg`uments using the
     * provided `Interpreter` instance.
     *
     * @param interpret the interpreter to execute this callable in.
     * @param args the arguments to pass to the callable routine.
     *
     * @returns the return value of the function, or `invalid` if nothing is explicitly returned.
     */
    abstract call(interpreter: Interpreter, args: BrsType[]): BrsType;

    lessThan(other: BrsType): BrsBoolean {
        return BrsBoolean.False;
    }

    greaterThan(other: BrsType): BrsBoolean {
        return BrsBoolean.False;
    }

    equalTo(other: BrsType): BrsBoolean {
        return BrsBoolean.from(this === other);
    }

    toString(): string {
        return `[Function]`
    }
}
