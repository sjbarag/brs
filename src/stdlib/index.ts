import { Callable, ValueKind, BrsType, BrsInvalid } from "../brsTypes";
import { Interpreter } from "../interpreter";

class RebootSystemCallable extends Callable {
    static WarningShown = false;

    signature = {
        name: "RebootSystem",
        args: []
    };

    call(interpreter: Interpreter): BrsInvalid {
        if (!RebootSystemCallable.WarningShown) {
            console.warn("`RebootSystem` is not implemented in `brs`.");
            RebootSystemCallable.WarningShown = true;
        }

        return BrsInvalid.Instance;
    }
};

export const RebootSystem: Callable = new RebootSystemCallable();
export * from "./String";