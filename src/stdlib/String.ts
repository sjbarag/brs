import { BrsType, Callable, ValueKind, BrsString, BrsNumber, Int32, Int64 } from "../brsTypes";
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

class AscCallable extends Callable {
    arity = {
        required: 1,
        optional: 0
    }

    call(interpreter: Interpreter, str: BrsString): BrsType {
        if (str.value.length == 0)
            return new Int32(0);
        else
            return new Int32(str.value[0].charCodeAt(0));
    }
}

class ChrCallable extends Callable {
    arity = {
        required: 1,
        optional: 0
    }

    call(interpreter: Interpreter, value: BrsType): BrsType {
        if (value instanceof Int32) {
            const num = value.getValue();
            if (num === 0)
                return new BrsString("");
            else
                return new BrsString(String.fromCharCode(num));
        } else {
            return new BrsString("");
        }
    }
}

export const UCase: Callable = new UCaseCallable();
export const LCase: Callable = new LCaseCallable();
export const Asc: Callable = new AscCallable();
export const Chr: Callable = new ChrCallable();