import { Interpreter } from "../interpreter";
import { Literal } from "../parser/Expression";
import {
    BrsBoolean,
    BrsInvalid,
    BrsString,
    BrsType,
    Callable,
    Int32,
    ValueKind
} from "../brsTypes";

function jsonValueOf(brsValue: any): any {
    if (brsValue.hasOwnProperty("value")) { return brsValue.value; }
    switch (brsValue.kind) {
    case ValueKind.Invalid:
        return null;
    default:
        throw `jsonValueOf not implemented for: ${brsValue}`;
    }
}

function brsValueOf(jsonValue: any): any {
    if (jsonValue === null) { return BrsInvalid.Instance; }
    switch (typeof jsonValue) {
    case "boolean":
        return BrsBoolean.from(jsonValue);
    default:
        throw `brsValueOf not implemented for: ${jsonValue}`;
    }
}

export const FormatJson = new Callable("FormatJson", {
    signature: { returns: ValueKind.String, args: [
        { name: "x", type: ValueKind.Object },
        { name: "flags", type: ValueKind.Int32, defaultValue: new Literal(new Int32(0)) }
    ]},
    impl: (_: Interpreter, x: BrsType, flags: Int32) => {
        try {
            return new BrsString(JSON.stringify(jsonValueOf(x)));
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
    impl: (_: Interpreter, jsonString: BrsString) => {
        try {
            return brsValueOf(JSON.parse(jsonString.value));
        } catch (err) {
            // example RBI error format: "BRIGHTSCRIPT: ERROR: ParseJSON: Unknown identifier 'I'm not JSON': pkg:/source/main.brs(25)"
            console.error(`ParseJSON: ${err.message}`);
            return BrsInvalid.Instance;
        }
    }
});
