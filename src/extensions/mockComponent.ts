import {
    ValueKind,
    Callable,
    StdlibArgument,
    BrsInvalid,
    RoAssociativeArray,
    BrsString,
} from "../brsTypes";
import { Interpreter } from "../interpreter";

export const mockComponent = new Callable("mockComponent", {
    signature: {
        args: [
            new StdlibArgument("objToMock", ValueKind.String),
            new StdlibArgument("mock", ValueKind.Object),
        ],
        returns: ValueKind.Void,
    },
    impl: (interpreter: Interpreter, objToMock: BrsString, mock: RoAssociativeArray) => {
        interpreter.environment.setMockObject(objToMock.toString(), mock);
        return BrsInvalid.Instance;
    },
});
