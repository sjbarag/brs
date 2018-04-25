let foundError = false;

export function make(message: string, line: number, file?: string) {
    foundError = true;
    return runtime(message, line, file);
}

export function runtime(message: string, line: number, file?: string) {
    let location = file ? `${file}: ${line}` : `Line ${line}`;
    let error = new Error(`[${location}] ${message}`);
    if (process.env.NODE_ENV !== "test") {
        console.error(error.message);
    }
    return error;
}

export function found() {
    return foundError;
}

export function reset() {
    foundError = false;
}