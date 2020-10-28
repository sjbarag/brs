import {
    ValueKind,
    Callable,
    StdlibArgument,
    BrsInvalid,
    RoAssociativeArray,
    BrsString,
    BrsBoolean,
    RoSGNode,
} from "../brsTypes";
import { Interpreter } from "../interpreter";
import { Stmt } from "../parser";

let ButtonNames: Set<string> = new Set([
    "back",
    "up",
    "down",
    "left",
    "right",
    "OK",
    "replay",
    "play",
    "playonly",
    "rewind",
    "fastforward",
    "options",
]);

export const triggerKeyEvent = new Callable("triggerKeyEvent", {
    signature: {
        args: [
            new StdlibArgument("key", ValueKind.String),
            new StdlibArgument("press", ValueKind.Boolean),
        ],
        returns: ValueKind.Void,
    },
    impl: (interpreter: Interpreter, key: BrsString, press: BrsBoolean) => {
        // Arbitrary key presses are supported, but they're prefixed by "Lit_"
        if (!ButtonNames.has(key.value)) {
            key = new BrsString("Lit_" + key.value);
        }

        let focusedNode = interpreter.environment.getFocusedNode();
        while (focusedNode instanceof RoSGNode) {
            // We need to use the focused node's environment
            let componentDef = interpreter.environment.nodeDefMap.get(
                focusedNode.nodeSubtype.toLowerCase()
            );

            if (componentDef) {
                let handled = interpreter.inSubEnv((subInterpreter) => {
                    let focusedM = (focusedNode as RoSGNode).m;
                    subInterpreter.environment.setM(focusedM);
                    subInterpreter.environment.setRootM(focusedM);

                    let onKeyEvent = subInterpreter.getCallableFunction("onkeyevent");
                    if (onKeyEvent?.getFirstSatisfiedSignature([key, press])) {
                        try {
                            return onKeyEvent.call(subInterpreter, key, press);
                        } catch (err) {
                            if (err instanceof Stmt.ReturnValue && err.value) {
                                return err.value;
                            }
                            throw err; // re-throw error to be handled elsewhere
                        }
                    }
                    return BrsBoolean.False;
                }, componentDef.environment);

                if (handled instanceof BrsBoolean && handled === BrsBoolean.True) break;
            }

            focusedNode = focusedNode.getParent();
        }

        return BrsInvalid.Instance;
    },
});
