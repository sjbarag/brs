import { Callable, ValueKind, BrsString, BrsBoolean } from "../brsTypes";
import { Interpreter } from "../interpreter";
import { Volume } from "memfs/lib/volume";

/* Returns the brs-path uri scheme or an empty string if not found */
export function parseVolumeName(path: string): string {
    const volumeRegex = new RegExp("^([a-z]+):");
    const volumePrefix = path.match(volumeRegex);
    if (volumePrefix !== null) {
        return volumePrefix[1];
    } else {
        return "";
    }
}

/*
 * Returns a memfs volume based on the brs path uri.  For example, passing in
 * "tmp:///test.txt" will return the memfs temporary volume on the interpreter. 
 * 
 * Returns invalid in no appopriate volume is found for the path
 */
export function getVolumeByPath(interpreter: Interpreter, path: string): Volume | null {
    const volumePrefix = parseVolumeName(path);
    if (volumePrefix === "tmp") {
        return interpreter.temporaryVolume;
    } else {
        return null;
    }
}

/*
 * Removed the scheme from the uri.
 *    ex. "tmp:///test/test1.txt" -> "///test/test1.txt"
 * 
 * NOTE: memfs as well as other file systems correctly handle extraneous slashes
 */
function stripScheme(brsUri: string): string {
    return brsUri.replace(parseVolumeName(brsUri) + ":", "");
}

/** Reads ascii file from file system. */
export const ReadAsciiFile = new Callable(
    "ReadAsciiFile",
    {
        signature: {
            args: [
                {name: "filepath", type: ValueKind.String}
            ],
            returns: ValueKind.String
        },
        impl: (interpreter: Interpreter, filepath: BrsString, text: BrsString) => {
            const volume = getVolumeByPath(interpreter, filepath.value);
            if (volume === null) {
                //console.warn("unable to read file: " + filepath.value);
                return new BrsString("");
            }

            const memfsPath = stripScheme(filepath.value);
            return new BrsString(volume.readFileSync(memfsPath).toString());
        }
    }
);

/** Writes a string to a temporary file. */
export const WriteAsciiFile = new Callable(
    "WriteAsciiFile",
    {
        signature: {
            args: [
                {name: "filepath", type: ValueKind.String},
                {name: "text", type: ValueKind.String}
            ],
            returns: ValueKind.Boolean
        },
        impl: (interpreter: Interpreter, filepath: BrsString, text: BrsString) => {
            const volume = getVolumeByPath(interpreter, filepath.value);
            if (volume === null) {
                //console.warn("unable to write file: " + filepath.value);
                return BrsBoolean.False;
            }

            volume.writeFileSync(filepath.value, text.value);
            return BrsBoolean.True;
        }
    }
);

