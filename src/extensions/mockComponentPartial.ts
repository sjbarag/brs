import {
    BrsType,
    ValueKind,
    Callable,
    StdlibArgument,
    BrsInvalid,
    RoAssociativeArray,
} from "../brsTypes";
import { Interpreter } from "../interpreter";

export const mockComponentPartial = new Callable("mockComponentPartial", {
    signature: {
        args: [new StdlibArgument("mock", ValueKind.Object)],
        returns: ValueKind.Void,
    },
    impl: (interpreter: Interpreter, mockFunctions: RoAssociativeArray) => {
        if (mockFunctions instanceof RoAssociativeArray) {
            [...mockFunctions.elements]
                .filter(([_, value]) => value.kind === ValueKind.Callable)
                .forEach(([key, value]) => {
                    if (value instanceof Callable) {
                        interpreter.environment.setMockFunction(key.toString(), value);
                    }
                });
        } else {
            interpreter.stderr.write(
                "mockFunctions paramter needs to be an instance of roAssociativeArray"
            );
        }
        return BrsInvalid.Instance;
    },
});
