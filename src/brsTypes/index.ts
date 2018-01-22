import { BrsInvalid, BrsBoolean, BrsString } from "./BrsType";
import { Int32 } from "./Int32";
import { Int64 } from "./Int64";
import { Float } from "./Float";
import { Double } from "./Double";

export * from "./BrsType";
export * from "./Int32";
export * from "./Int64";
export * from "./Float"
export * from "./Double";

/** The set of all supported types in BrightScript. */
export type BrsType =
    BrsInvalid |
    BrsBoolean |
    BrsString |
    Int32 |
    Int64 |
    Float |
    Double;