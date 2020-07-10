import {
    BrsType,
    BrsString,
    ValueKind,
    Callable,
    StdlibArgument,
    BrsInvalid,
    RoAssociativeArray,
} from "../brsTypes";
import { Interpreter } from "../interpreter";

export const mockFunctions = new Callable("mockFunctions", {
    signature: {
        args: [
            new StdlibArgument("subtype", ValueKind.String),
            new StdlibArgument("mock", ValueKind.Object),
        ],
        returns: ValueKind.Void,
    },
    impl: (interpreter: Interpreter, subtype: BrsString, mockFunctions: RoAssociativeArray) => {
        let maybeComponent = interpreter.environment.nodeDefMap.get(subtype.value);
        console.log("MAYBE COMPONENT");
        console.log(maybeComponent);

        if (!maybeComponent) {
            interpreter.stderr.write(
                `Unable to mock functions for unknown roSGNode subtype ${subtype.value}`
            );
            return BrsInvalid.Instance;
        }
        if (mockFunctions instanceof RoAssociativeArray) {
            [...mockFunctions.elements]
                .filter(([_, value]) => value.kind === ValueKind.Callable)
                .forEach(([key, value]) => {
                    if (value instanceof Callable) {
                        console.log("INTERPRETER ENV - BEFORE");
                        console.log(interpreter.environment.getMockFunction(key.toLowerCase()));
                        console.log("SETTING EACH MOCK FUNCTION - BEFORE");
                        console.log(maybeComponent?.environment?.getMockFunction(key.toString()));
                        maybeComponent?.environment?.setMockFunction(key.toString(), value);
                        console.log("SETTING EACH MOCK FUNCTION - AFTER");
                        console.log(
                            maybeComponent?.environment?.getMockFunction(key.toLowerCase())
                        );
                        console.log("INTERPRETER ENV - AFTER");
                        console.log(interpreter.environment.getMockFunction(key.toLowerCase()));
                    }
                });
        } else {
            interpreter.stderr.write(
                "mockFunctions parameter needs to be an instance of roAssociativeArray"
            );
        }
        return BrsInvalid.Instance;
    },
});
