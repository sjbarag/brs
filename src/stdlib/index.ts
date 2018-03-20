import { Callable, ValueKind, BrsType, BrsInvalid } from "../brsTypes";
import { Interpreter } from "../interpreter";

class RebootSystemCallable extends Callable {
    static WarningShown = false;
    arity = {
        required: 0,
        optional: 0
    };

    call(interpreter: Interpreter, args: BrsType[]): BrsInvalid {
        if (!RebootSystemCallable.WarningShown) {
            console.warn("`RebootSystem` is not implemented in `brs`.");
            RebootSystemCallable.WarningShown = true;
        }

        return BrsInvalid.Instance;
    }
};

export const RebootSystem: Callable = new RebootSystemCallable();