import { Interpreter } from "../interpreter";
import * as Brs from "./";
import { Token } from "../Token";

export class Argument {
    constructor(
        readonly name: string,
        readonly type: Brs.ValueKind = Brs.ValueKind.Dynamic,
        readonly defaultValue?: Brs.BrsType
    ) {}
}

/** Describes the number of required and optional arguments for a `Callable`. */
export interface Arity {
    /** The minimum number of arguments required for this function call. */
    required: number,
    /** The number of optional arguments accepted by this function. */
    optional: number
}

export interface Signature {
    name: string,
    args: Argument[]
}

/** A `function` or `sub` (either "native" or implemented in BrightScript) that can be called in a BrightScript file. */
export abstract class Callable implements Brs.BrsValue {
    readonly kind = Brs.ValueKind.Callable;

    /** The arity of this callable stored after it was first calculated. */
    private memoizedArity?: Arity;

    /**
     * Calculates and returns the number of arguments expected by this function.
     * @returns an object containing the number of required and optional arguments.
     */
    arity(): Arity {
        if (!this.memoizedArity) {
            this.memoizedArity = {
                required: this.signature.args.filter(a => !a.defaultValue).length,
                optional: this.signature.args.filter(a => !!a.defaultValue).length
            };
        }

        return this.memoizedArity;
    };

    abstract readonly signature: Signature;

    /**
     * Calls the function this `Callable` represents with the provided `arg`uments using the
     * provided `Interpreter` instance.
     *
     * @param interpret the interpreter to execute this callable in.
     * @param args the arguments to pass to the callable routine.
     *
     * @returns the return value of the function, or `invalid` if nothing is explicitly returned.
     */
    abstract call(interpreter: Interpreter, ...args: Brs.BrsType[]): Brs.BrsType;

    lessThan(other: Brs.BrsType): Brs.BrsBoolean {
        return Brs.BrsBoolean.False;
    }

    greaterThan(other: Brs.BrsType): Brs.BrsBoolean {
        return Brs.BrsBoolean.False;
    }

    equalTo(other: Brs.BrsType): Brs.BrsBoolean {
        return Brs.BrsBoolean.from(this === other);
    }

    toString(): string {
        // TODO: Add support for named functions
        return `[Function]`
    }
}
