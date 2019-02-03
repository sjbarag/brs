import { BrsType, ValueKind } from "./brsTypes";
import { TokenLocation } from "./lexer";

export class BrsError extends Error {
    constructor(message: string, location: TokenLocation) {
        let formattedLocation: string;

        if (location.start.line === location.end.line) {
            formattedLocation = `${location.file}: ${location.start.line}:${location.start.column}`;
            if (location.start.column !== location.end.column) {
                formattedLocation += `-${location.end.column}`;
            }
        } else {
            formattedLocation = `${location.file}: ${location.start.line}:${location.start.column}-${location.end.line}:${location.end.line}`;
        }

        let output = `[${formattedLocation}] ${message}`;
        super(output);
    }
}

/** Wraps up the metadata associated with a type mismatch error. */
export interface TypeMismatchMetadata {
    /**
     * The base message to use for this error. Should be as helpful as possible, e.g.
     * "Attempting to subtract non-numeric values".
     */
    message: string,
    /** The value on the left-hand side of a binary operator, or the *only* value for a unary operator. */
    left: TypeAndLocation,
    /** The value on the right-hand side of a binary operator. */
    right?: TypeAndLocation,
}

export type TypeAndLocation = {
    /** The type of a value involved in a type mismatch. */
    type: BrsType,
    /** The location at which the offending value was resolved. */
    location: TokenLocation
}

/**
 * Creates a "type mismatch"-like error message, but with the appropriate types specified.
 * @return a type mismatch error that will be tracked by this module.
 */
export class TypeMismatch extends BrsError {
    constructor(mismatchMetadata: TypeMismatchMetadata) {
        let messageLines = [
            mismatchMetadata.message,
            `    left: ${ValueKind.toString(mismatchMetadata.left.type.kind)}`
        ];
        let location = mismatchMetadata.left.location;

        if (mismatchMetadata.right) {
            messageLines.push(
            `    right: ${ValueKind.toString(mismatchMetadata.right.type.kind)}`
            );

            location.end = mismatchMetadata.right.location.end;
        }

        super(messageLines.join("\n"), location);
    }
}