import { Callable, ValueKind, BrsString, Int32 } from "../brsTypes";
import { Interpreter } from "../interpreter";

export const Tab = new Callable(
    {
        name: "Tab",
        args: [{ name: "position", type: ValueKind.Int32 }]
    },
    (interpreter: Interpreter, position: Int32) => {
        let target = position.getValue();
        if (target < 0 || target < interpreter.stdout.position()) {
            return new BrsString("");
        }

        // TODO: this probably won't handle text wrapping well, but I'm not
        // sure what the reference implementation does here yet
        return new BrsString(" ".repeat(target - interpreter.stdout.position()));
    }
);

export const Pos = new Callable(
    {
        name: "Tab",
        // `pos` expects an argument and doesn't use it. The refreence
        // implementation's documentation even says it must be provided but
        // isn't used: https://sdkdocs.roku.com/display/sdkdoc/Program+Statements#ProgramStatements-PRINTitemlist
        args: [{ name: "dummy", type: ValueKind.Dynamic }]
    },
    (interpreter: Interpreter) => {
        return new Int32(interpreter.stdout.position());
    }
);