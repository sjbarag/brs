import type { Location } from "./lexer";

export class BrsError extends Error {
    constructor(message: string, readonly location: Location) {
        super(message);
    }

    /**
     * Formats the error into a human-readable string including filename, starting and ending line
     * and column, and the message associated with the error, e.g.:
     *
     * `lorem.brs(1,1-3): Expected '(' after sub name`
     * @see BrsError#format
     */
    format() {
        return BrsError.format(this.message, this.location);
    }

    /**
     * Formats a location and message into a human-readable string including filename, starting
     * and ending line and column, and the message associated with the error, e.g.:
     *
     * `lorem.brs(1,1-3): Expected '(' after sub name`
     *
     * @param message a string describing the error
     * @param location where the error occurred
     */
    static format(message: string, location: Location): string {
        let formattedLocation: string;

        if (location.start.line === location.end.line) {
            let columns = `${location.start.column}`;
            if (location.start.column !== location.end.column) {
                columns += `-${location.end.column}`;
            }
            formattedLocation = `${location.file}(${location.start.line},${columns})`;
        } else {
            formattedLocation = `${location.file}(${location.start.line},${location.start.column},${location.end.line},${location.end.line})`;
        }

        return `${formattedLocation}: ${message}\n`;
    }
}

/**
 * Logs a detected BRS error to console.
 * @param err the error to log to console
 */
export function logConsoleError(err: BrsError) {
    console.error(err.format());
}

/**
 * Produces a function that writes errors to the given error stream.
 * @param errorStream write stream to write errors to.
 * @returns function that writes to given write stream.
 */
export function getLoggerUsing(errorStream: NodeJS.WriteStream): (err: BrsError) => boolean {
    return (err) => errorStream.write(err.format());
}
