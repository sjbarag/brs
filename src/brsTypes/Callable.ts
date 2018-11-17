import { Interpreter } from "../interpreter";
import * as Brs from ".";
import { Token } from "../Token";
import * as Expr from "../parser/Expression";
import { Scope } from "../interpreter/Environment";

/** An argument to a BrightScript `function` or `sub`. */
export interface Argument {
    /** The argument's name. */
    readonly name: string,
    /** The type of the argument expected by the BrightScript runtime. */
    readonly type: Brs.ValueKind,
    /** The default value to use for the argument if none is provided. */
    readonly defaultValue?: Expr.Expression
}

/** A BrightScript `function` or `sub`'s signature. */
export interface Signature {
    /** The set of arguments a function accepts. */
    readonly args: ReadonlyArray<Argument>,
    /** The type of BrightScript value the function will return. `sub`s must use `ValueKind.Void`. */
    readonly returns: Brs.ValueKind
}

/** Describes the number of required and optional arguments for a `Callable`. */
export interface Arity {
    /** The minimum number of arguments required for this function call. */
    required: number,
    /** The number of optional arguments accepted by this function. */
    optional: number
}

/*
 * Note that TypeScript's `--strictFunctionTypes` compiler argument prevents the `args` parameter
 * from being typed as `...args: Brs.BrsType[]` here. See
 * https://www.stephanboyer.com/post/132/what-are-covariance-and-contravariance for a wonderful
 * description of why.
 */
/** The function type required for all concrete Callables to provide. */
export type CallableImplementation = (interpreter: Interpreter, ...args: any[]) => Brs.BrsType;

/** A `function` or `sub` (either "native" or implemented in BrightScript) that can be called in a BrightScript file. */
export class Callable implements Brs.BrsValue {
    readonly kind = Brs.ValueKind.Callable;

    /** The name of this function within the BrightScript runtime. */
    readonly name: string | undefined;

    /** The signature of this callable within the BrightScript runtime. */
    readonly signature: Signature;

    /**
     * Calculates and returns the number of arguments expected by this function.
     * @returns an object containing the number of required and optional arguments.
     */
    readonly arity: Arity;

    /**
     * Calls the function this `Callable` represents with the provided `arg`uments using the
     * provided `Interpreter` instance.
     *
     * @param interpreter the interpreter to execute this callable in.
     * @param args the arguments to pass to the callable routine.
     *
     * @returns the return value of the function, or `invalid` if nothing is explicitly returned.
     */
    call(interpreter: Interpreter, ...args: Brs.BrsType[]) {
        // first, we need to evaluate all of the parameter default values
        // and define them in a new environment
        let subEnvironment = interpreter.environment.createSubEnvironment();

        let mutableArgs = args.slice();

        return interpreter.inSubEnv(subEnvironment, (subInterpreter) => {
            this.signature.args.forEach((param, index) => {
                if (param.defaultValue && mutableArgs[index] == null) {
                    mutableArgs[index] = subInterpreter.evaluate(param.defaultValue);
                }

                subEnvironment.define(Scope.Function, param.name, mutableArgs[index]);
            });

            // then return whatever the function's implementation would return
            return this.impl(subInterpreter, ...mutableArgs);
        });
    }

    /**
     * Creates a new BrightScript `function` or `sub`.
     * @param signature the signature this callable should have within the BrightScript runtime.
     * @param impl the (JavaScript) function to call when this `callable` is executed.
     */
    constructor(name: string | undefined, signature: Signature, protected impl: CallableImplementation) {
        this.name = name;
        this.signature = signature;
        this.arity = {
            required: this.signature.args.filter(a => !a.defaultValue).length,
            optional: this.signature.args.filter(a => !!a.defaultValue).length
        };
    }

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
        if (this.name) {
            return `[Function ${this.name}]`;
        } else {
            return "[anonymous function]";

        }
    }

    getName(): string {
        return this.name || "";
    }
}
