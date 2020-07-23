import { ValueKind, Callable, BrsInvalid } from "../brsTypes";
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
        interpreter.environment.resetMockFunctions();
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
