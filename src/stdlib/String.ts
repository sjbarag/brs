import { BrsType, Callable, ValueKind, BrsString } from "../brsTypes";
import { Interpreter } from "../interpreter";

class UCaseCallable extends Callable {
    arity = {
        required: 1,
        optional: 0
    };

    call(interpreter: Interpreter, str: BrsString): BrsType {
        // TODO: Figure out how to handle type checking centrally
        return new BrsString(str.value.toUpperCase());
    }
}

class LCaseCallable extends Callable {
    arity = {
        required: 1,
        optional: 0
    };

    call(interpreter: Interpreter, str: BrsString): BrsType {
        return new BrsString(str.value.toLowerCase());
    }
}

export const UCase: Callable = new UCaseCallable();
export const LCase: Callable = new LCaseCallable();