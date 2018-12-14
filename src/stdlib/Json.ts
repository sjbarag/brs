import { Interpreter } from "../interpreter";
import { Literal } from "../parser/Expression";
import {
    BrsBoolean,
    BrsInvalid,
    BrsString,
    BrsType,
    Callable,
    Float,
    Int32,
    Int64,
    ValueKind
} from "../brsTypes";

function isInt32(n: number): boolean {
    const lo: number = -2_147_483_648;
    const hi: number = 2_147_483_647;
    return Number.isInteger(n) && n >= lo && n <= hi;
}

function brsValueOf(x: any): any {
    if (x === null) { return BrsInvalid.Instance; }
    let t: string = typeof x;
    let errMsg: string = "";

    switch (t) {
    case "boolean":
        return BrsBoolean.from(x);
    case "string":
        return new BrsString(x);
    case "number":
        if (Number.isInteger(x)) {
            return isInt32(x) ? new Int32(x) : new Int64(x);
        }
        return new Float(x);
    default:
        errMsg = `brsValueOf not implemented for: ${x} <${t}>`;
        break;
    }
    if (errMsg.trim() !== "") { throw errMsg; }
}

function jsonValueOf(x: any): any {
    if (x.hasOwnProperty("value")) { return x.value; }
    let kind: ValueKind = x.kind;
    switch (kind) {
    case ValueKind.Invalid:
        return null;
    default:
        throw `jsonValueOf not implemented for: ${x} <${kind}>`;
    }
}

function logBrsErr(functionName: string, err: Error): void {
    console.error(`BRIGHTSCRIPT: ERROR: ${functionName}: ${err.message}`);
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
            logBrsErr("FormatJSON", err);
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
            logBrsErr("ParseJSON", err);
            return BrsInvalid.Instance;
        }
    }
});
