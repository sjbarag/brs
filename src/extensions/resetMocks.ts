import { ValueKind, Callable, BrsInvalid, StdlibArgument, BrsString } from "../brsTypes";
import { Interpreter } from "../interpreter";

export const resetMocks = new Callable("resetMocks", {
    signature: {
        args: [],
        returns: ValueKind.Void,
    },
    impl: (interpreter: Interpreter) => {
        interpreter.environment.resetMocks();
        return BrsInvalid.Instance;
    },
});

export const resetMockFunctions = new Callable("resetMockFunctions", {
    signature: {
        args: [],
        returns: ValueKind.Void,
    },
    impl: (interpreter: Interpreter) => {
        interpreter.environment.resetUnscopedMockFunctions();
        return BrsInvalid.Instance;
    },
});

export const resetMockFunction = new Callable("resetMockFunction", {
    signature: {
        args: [new StdlibArgument("mockName", ValueKind.String)],
        returns: ValueKind.Void,
    },
    impl: (interpreter: Interpreter, mockName: BrsString) => {
        interpreter.environment.resetUnscopedMockFunction(mockName.toString());
        return BrsInvalid.Instance;
    },
});

export const resetMockComponents = new Callable("resetMockComponents", {
    signature: {
        args: [],
        returns: ValueKind.Void,
    },
    impl: (interpreter: Interpreter) => {
        interpreter.environment.resetMockObjects();
        return BrsInvalid.Instance;
    },
});

export const resetMockComponent = new Callable("resetMockComponent", {
    signature: {
        args: [new StdlibArgument("mockName", ValueKind.String)],
        returns: ValueKind.Void,
    },
    impl: (interpreter: Interpreter, mockName: BrsString) => {
        interpreter.environment.resetMockObject(mockName.toString());
        return BrsInvalid.Instance;
    },
});
