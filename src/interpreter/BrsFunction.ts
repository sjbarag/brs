import { Callable, BrsInvalid, BrsType } from "../brsTypes";
import * as Stmt from "../parser/Statement";
import { Interpreter } from "../interpreter";
import { Expression } from "../parser/Expression";
import Environment from "../interpreter/Environment";

/**
 * Converts a Function declaration to a BrightScript callable representation so
 * that it can be executed.
 *
 * @param declaration the function declaration to convert
 * @returns a `Callable` version of that function
 */
export function toCallable(declaration: Stmt.Function) {
    return new Callable(
        {
            name: declaration.name.text,
            args: declaration.parameters
        },
        (interpreter: Interpreter, ...args: BrsType[]) => {
            // first, we need to evaluate all of the parameter default values
            // and define them in a new environment
            let environment = Environment.from(interpreter.environment);
            declaration.parameters.forEach((param, index) => {
                if (param.defaultValue) {
                    environment.define(param.name, interpreter.evaluate(param.defaultValue));
                    return;
                }

                environment.define(param.name, args[index])
            });

            let result = interpreter.execWith(declaration.body.statements, environment);

            // then return whatever BrightScript returned
            // TODO: Add support for return statements
            return BrsInvalid.Instance;
        }
    );
}