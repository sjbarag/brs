import {
    RoAssociativeArray,
    BrsString,
    RoArray,
    Callable,
    ValueKind,
    RoDeviceInfo,
    BrsInvalid,
    StdlibArgument,
    RoAppInfo,
} from "../brsTypes";
import { Interpreter } from "../interpreter";
import * as PP from "../preprocessor";

export const Process = new RoAssociativeArray([
    {
        name: new BrsString("argv"),
        value: new RoArray(process.argv.map((arg) => new BrsString(arg))),
    },
    {
        name: new BrsString("getLocale"),
        value: new Callable("getLocale", {
            signature: {
                returns: ValueKind.String,
                args: [],
            },
            impl: (_: Interpreter) => {
                return new BrsString(RoDeviceInfo.locale);
            },
        }),
    },
    {
        name: new BrsString("setLocale"),
        value: new Callable("setLocale", {
            signature: {
                returns: ValueKind.Invalid,
                args: [new StdlibArgument("newLocale", ValueKind.String)],
            },
            impl: (_: Interpreter, newLocale: BrsString) => {
                RoDeviceInfo.locale = newLocale.value;
                return BrsInvalid.Instance;
            },
        }),
    },
    {
        name: new BrsString("setManifest"),
        value: new Callable("setManifest", {
            signature: {
                returns: ValueKind.Invalid,
                args: [new StdlibArgument("path", ValueKind.String)],
            },
            // Specify the root directory in which a `manifest` file is expected or set an empty string to use default root folder.
            impl: (_: Interpreter, path: BrsString) => {
                let root = process.cwd() + path.toString();

                RoAppInfo.manifest = PP.getManifestSync(root);
                return BrsInvalid.Instance;
            },
        }),
    },
]);
