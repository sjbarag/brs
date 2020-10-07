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

export const mockComponentPartial = new Callable("mockComponentPartial", {
    signature: {
        args: [
            new StdlibArgument("subtype", ValueKind.String),
            new StdlibArgument("mock", ValueKind.Object),
        ],
        returns: ValueKind.Void,
    },
    impl: (interpreter: Interpreter, subtype: BrsString, mockFunctions: RoAssociativeArray) => {
        let maybeComponent = interpreter.environment.nodeDefMap.get(subtype.value.toLowerCase());

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
                        maybeComponent?.environment?.setMockFunction(
                            key.toString(),
                            value,
                            /* isScoped */ true
                        );
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
