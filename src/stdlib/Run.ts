import * as path from "path";

import * as brs from "../";
import { BrsType, ValueKind, Callable, BrsString, BrsInvalid, StdlibArgument } from "../brsTypes";
import { Interpreter } from "../interpreter";
import { getVolumeByPath, getPath } from "./File";

export const Run = new Callable("Run", {
    signature: {
        args: [
            new StdlibArgument("filename", ValueKind.String),
            new StdlibArgument("arg0", ValueKind.Dynamic, BrsInvalid.Instance),
        ],
        returns: ValueKind.String,
    },
    impl: (interpreter: Interpreter, filename: BrsString, ...args: BrsType[]) => {
        let volume = getVolumeByPath(interpreter, filename.value);
        let pathToFile = path.join(interpreter.options.root, getPath(filename.value));

        // if the file-to-run doesn't exist, RBI returns invalid
        if (!volume) {
            return BrsInvalid.Instance;
        }

        try {
            let results = brs.executeSync([pathToFile], interpreter.options);
            return results[0] || BrsInvalid.Instance;
        } catch (err) {
            // swallow errors and just return invalid; RBI returns invalid for "file doesn't exist" errors,
            // syntax errors, etc.
            return BrsInvalid.Instance;
        }
    },
});
