import { BrsType } from "../brsTypes";
import * as BrsError from "../Error";

export interface BlockEnd {
    kind: StopReason
}

export enum StopReason {
    ExitFor,
    ExitWhile,
    Return,
    RuntimeError
}

export class ExitFor implements BlockEnd {
    kind = StopReason.ExitFor;
}

export class ExitWhile implements BlockEnd {
    kind = StopReason.ExitWhile
}

export class ReturnValue implements BlockEnd {
    kind = StopReason.ExitWhile;

    constructor(readonly value: BrsType) {}
}

export class Runtime implements BlockEnd {
    kind = StopReason.RuntimeError;
}