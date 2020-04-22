import { BrsInvalid, BrsType, Callable, StdlibArgument, ValueKind } from "../brsTypes";
import { Interpreter } from "../interpreter";

export const mockFunction = new Callable("mockFunction", {
    signature: {
        args: [
            new StdlibArgument("functionToMock", ValueKind.String),
            new StdlibArgument("mock", ValueKind.Callable),
        ],
        returns: ValueKind.Invalid,
    },
    impl: (interpreter: Interpreter, functionToMock: BrsType, mock: Callable) => {
        interpreter.environment.setMockFunction(functionToMock.toString(), mock);
        return BrsInvalid.Instance;
    },
});
