import { BrsInvalid, BrsString, BrsType, Callable, Int32, ValueKind } from "../brsTypes";
import { Interpreter } from "../interpreter";
import * as Expr from "../parser/Expression";

export const FormatJson = new Callable("FormatJson", {
    signature: { returns: ValueKind.String, args: [
        { name: "json", type: ValueKind.Object },
        { name: "flags", type: ValueKind.Int32, defaultValue: new Expr.Literal(new Int32(0)) }
    ]},
    impl: (interpreter: Interpreter, json: BrsType, flags: Int32) => {
        try {
            return new BrsString('null');
            // TODO: JSON.stringify
        } catch (err) {
            // example RBI error format: "BRIGHTSCRIPT: ERROR: FormatJSON: Value type not supported: roFunction: pkg:/source/main.brs(14)"
            console.error(`FormatJSON: ${err.message}`);
            return new BrsString("");
        }
    }
});

export const ParseJson = new Callable("ParseJson", {
    signature: { returns: ValueKind.Dynamic, args: [
        { name: "jsonString", type: ValueKind.String }
    ]},
    impl: (interpreter: Interpreter, jsonString: BrsString) => {
        try {
            return BrsInvalid.InstancePass;
            // TODO: JSON.parse
        } catch (err) {
            // example RBI error format: "BRIGHTSCRIPT: ERROR: ParseJSON: Unknown identifier 'I'm not JSON': pkg:/source/main.brs(25)"
            console.error(`ParseJSON: ${err.message}`);
            return BrsInvalid.Instance;
        }
    }
});
