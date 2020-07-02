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
        return BrsInvalid.Instance;
    },
});
