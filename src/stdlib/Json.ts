import { AssociativeArray } from "../brsTypes/components/AssociativeArray";
import { BrsArray } from "../brsTypes/components/BrsArray";
import { Interpreter } from "../interpreter";
import { Literal } from "../parser/Expression";
import { randomBytes } from "crypto";

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

function brsValueOf(x: any): BrsType {
    if (x === null) { return BrsInvalid.Instance; }
    let t: string = typeof x;
    switch (t) {
    case "boolean":
        return BrsBoolean.from(x);
    case "string":
        return new BrsString(x);
    case "number":
        if (Number.isInteger(x)) {
            return x >= -2_147_483_648 && x <= 2_147_483_647 ? new Int32(x) : new Int64(x);
        }
        return new Float(x);
    case "object":
        if (Array.isArray(x)) {
            return new BrsArray(x.map(brsValueOf));
        }
        return new AssociativeArray(
            Object.getOwnPropertyNames(x).map((k: string) => {
                return {
                    name: new BrsString(k),
                    value: brsValueOf(x[k])
                };
            })
        );
    default:
        throw new Error(`brsValueOf not implemented for: ${x} <${t}>`);
    }
}

function jsonOf(interpreter: Interpreter, x: BrsType, uid: BrsString): string {
    switch (x.kind) {
    case ValueKind.Invalid:
        return "null";
    case ValueKind.String:
        return `"${x.toString()}"`;
    case ValueKind.Boolean:
    case ValueKind.Double:
    case ValueKind.Float:
    case ValueKind.Int32:
    case ValueKind.Int64:
        return x.toString();
    case ValueKind.Object:
        if (x instanceof AssociativeArray) {
            try {
                if (x.get(uid) !== BrsInvalid.Instance) {
                    throw new Error("Nested object reference");
                }
                let elements = x.getElements();
                x.set(uid, BrsBoolean.True);
                return `{${elements.map((k: BrsString) => {
                    return `"${k.toString()}":${jsonOf(interpreter, x.get(k), uid)}`;
                }).join(",")}}`;
            } finally {
                let m: Callable | undefined = x.getMethod("delete");
                if (m) { m.call(interpreter, uid); }
            }
        }
        if (x instanceof BrsArray) {
            return `[${x.getElements().map((el: BrsType) => { return jsonOf(interpreter, el, uid); }).join(",")}]`;
        }
        break;
    case ValueKind.Callable:
    case ValueKind.Uninitialized:
        break;
    default:
        const _: never = x;
        break;
    }
    throw new Error(`jsonOf not implemented for: ${x}`);
}

function logBrsErr(functionName: string, err: Error): void {
    if (process.env.NODE_ENV === "test") { return; }
    console.error(`BRIGHTSCRIPT: ERROR: ${functionName}: ${err.message}`);
}

export const FormatJson = new Callable("FormatJson", {
    signature: { returns: ValueKind.String, args: [
        { name: "x", type: ValueKind.Object },
        { name: "flags", type: ValueKind.Int32, defaultValue: new Literal(new Int32(0)) }
    ]},
    impl: (interpreter: Interpreter, x: BrsType, _flags: Int32) => {
        try {
            return new BrsString(jsonOf(interpreter, x, new BrsString(randomBytes(20).toString("hex"))));
        } catch (err) {
            // example RBI error:
            // "BRIGHTSCRIPT: ERROR: FormatJSON: Value type not supported: roFunction: pkg:/source/main.brs(14)"
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
            let s: string = jsonString.toString().trim();

            if (s === "") { throw new Error("Data is empty"); }

            return brsValueOf(JSON.parse(s));
        } catch (err) {
            // example RBI error:
            // "BRIGHTSCRIPT: ERROR: ParseJSON: Unknown identifier 'x': pkg:/source/main.brs(25)"
            logBrsErr("ParseJSON", err);
            return BrsInvalid.Instance;
        }
    }
});
