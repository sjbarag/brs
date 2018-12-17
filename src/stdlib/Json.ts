import { AssociativeArray as BrsAssociativeArray } from "../brsTypes/components/AssociativeArray";
import { BrsArray } from "../brsTypes/components/BrsArray";
import { Interpreter } from "../interpreter";
import { Literal } from "../parser/Expression";
import {
    BrsBoolean,
    BrsInvalid,
    BrsString,
    BrsType,
    BrsValue,
    Callable,
    Float as BrsFloat,
    Int32 as BrsInteger,
    Int64 as BrsLongInteger,
    Uninitialized as BrsUninitialized,
    ValueKind
} from "../brsTypes";

function isInt32(n: number): boolean {
    const lo: number = -2_147_483_648;
    const hi: number = 2_147_483_647;
    return Number.isInteger(n) && n >= lo && n <= hi;
}

type BrsJsonValue = any; //BrsValue;
type TsJsonValue = any;

function brsValueOf(x: TsJsonValue): BrsJsonValue {
    if (x === null) { return BrsInvalid.Instance; }
    let t: string = typeof x;
    switch (t) {
    case "boolean":
        return BrsBoolean.from(x);
    case "string":
        return new BrsString(x);
    case "number":
        if (Number.isInteger(x)) {
            return isInt32(x) ? new BrsInteger(x) : new BrsLongInteger(x);
        }
        return new BrsFloat(x);
    case "object":
        if (Array.isArray(x)) {
            return new BrsArray(x.map(brsValueOf));
        }
        return new BrsAssociativeArray(
            x.getOwnPropertyNames().map((k: string) => {
                return [k, x[k]].map(brsValueOf);
            })
        );
    default:
        throw new Error(`brsValueOf not implemented for: ${x} <${t}>`);
    }
}

type ItemFn = (k: BrsString, v: BrsValue) => string;
function itemsMap(brsAa: BrsAssociativeArray, fn: ItemFn) {
    return brsAa.getElements().map((key) => {
        return fn(key, brsAa.get(key));
    });
}

type ElementFn = (v: BrsJsonValue) => string;
function elementsMap(brsArray: BrsArray, fn: ElementFn) {
    return brsArray.getElements().map(fn);
}

function jsonOfItem(k: BrsString, v: BrsValue): string {
    return `"${k.toString()}":${jsonOf(v)}`;
}

function jsonOf(x: BrsValue): string {
    if (x instanceof BrsInvalid) {
        return "null";
    }
    if (x instanceof BrsAssociativeArray) {
        return `{${itemsMap(x, jsonOfItem).join(",")}}`;
    }
    if (x instanceof BrsArray) {
        return `[${elementsMap(x, jsonOf).join(",")}]`;
    }
    if (x instanceof BrsString) {
        return `"${x.toString()}"`;
    }
    if (!(x instanceof BrsUninitialized)) {
        return x.toString();
    }
    throw new Error(`jsonValueOf not implemented for: ${x}`);
}

function logBrsErr(functionName: string, err: Error): void {
    console.error(`BRIGHTSCRIPT: ERROR: ${functionName}: ${err.message}`);
}

export const FormatJson = new Callable("FormatJson", {
    signature: { returns: ValueKind.String, args: [
        { name: "x", type: ValueKind.Object },
        {
            name: "flags",
            type: ValueKind.Int32,
            defaultValue: new Literal(new BrsInteger(0))
        }
    ]},
    impl: (_: Interpreter, x: BrsType, flags: BrsInteger) => {
        try {
            return new BrsString(jsonOf(x));
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
            return brsValueOf(JSON.parse(jsonString.toString()));
        } catch (err) {
            // example RBI error:
            // "BRIGHTSCRIPT: ERROR: ParseJSON: Unknown identifier 'x': pkg:/source/main.brs(25)"
            logBrsErr("ParseJSON", err);
            return BrsInvalid.Instance;
        }
    }
});
