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
            args: declaration.parameters,
            returns: declaration.returns
        },
        (interpreter: Interpreter, ...args: BrsType[]) => {
            // first, we need to evaluate all of the parameter default values
            // and define them in a new environment
            let subEnvironment = Environment.from(interpreter.environment);

            interpreter.inSubEnv(subEnvironment, (subInterpreter) => {
                declaration.parameters.forEach((param, index) => {
                    if (param.defaultValue) {
                        subEnvironment.define(param.name, subInterpreter.evaluate(param.defaultValue));
                        return;
                    }

                    subEnvironment.define(param.name, args[index])
                });
            });

            // then return whatever BrightScript returned
            // TODO: prevent `sub`s from returning values?
            return interpreter.executeBlock(declaration.body, subEnvironment);
        }
    );
}