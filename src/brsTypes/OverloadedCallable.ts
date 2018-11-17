import { Callable, CallableImplementation, Signature } from "./Callable";
import { Interpreter } from "../interpreter";
import * as Brs from ".";
import { ValueKind } from "./BrsType";

/** A BrightScript function signature paired with its implementation. */
type SignatureAndImplementation = {
    signature: Signature,
    impl: CallableImplementation
};

export class OverloadedCallable extends Callable {
    private signatures: SignatureAndImplementation[];

    call(interpreter: Interpreter, ...args: Brs.BrsType[]) {
        let satisfiedSignature = this.getFirstSatisfiedSignature(args);
        this.impl = satisfiedSignature!.impl;

        return super.call(interpreter, ...args);
    }

    constructor(name: string, ...signatures: SignatureAndImplementation[]) {
        let firstSig = signatures[0];

        super(name, firstSig.signature, firstSig.impl);
        this.signatures = signatures;
    }

    hasSatisfiedSignature(args: Brs.BrsType[]) {
        return this.getFirstSatisfiedSignature(args) != null;
    }

    private getFirstSatisfiedSignature(args: Brs.BrsType[]): SignatureAndImplementation | undefined {
        return this.signatures.filter(sigAndImpl =>
            this.getSignatureMismatches(sigAndImpl.signature, args).length === 0
        )[0];
    }

    private getSignatureMismatches(sig: Signature, args: Brs.BrsType[]): SignatureMismatch[] {
        let reasons: SignatureMismatch[] = [];

        if (sig.args.length < args.length) {
            reasons.push({
                reason: MismatchReason.TooFewArguments,
                expected: sig.args.length.toString(),
                received: args.length.toString()
            });
        } else if (sig.args.length > args.length) {
            reasons.push({
                reason: MismatchReason.TooManyArguments,
                expected: sig.args.length.toString(),
                received: args.length.toString()
            });
        }


        sig.args.slice(0, Math.min(sig.args.length, args.length)).forEach((_value, index) => {
            let expected = sig.args[index];
            let received = args[index];

            if (expected.type === ValueKind.Dynamic) { return; }

            if (expected.type !== received.kind) {
                reasons.push({
                    reason: MismatchReason.ArgumentTypeMismatch,
                    expected: ValueKind.toString(expected.type),
                    received: ValueKind.toString(received.kind)
                });
            }
        });

        return reasons;
    }
}

export interface SignatureMismatch {
    reason: MismatchReason,
    expected: string,
    received: string
}

export enum MismatchReason {
    /** Not enough arguments were provided to satisfy a signature. */
    TooFewArguments,
    /** Too many arguments were provided to satisfy a signature. */
    TooManyArguments,
    /** An argument's type didn't match the signature's type. */
    ArgumentTypeMismatch
}