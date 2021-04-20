import {
    RoAssociativeArray,
    BrsString,
    RoArray,
    Callable,
    ValueKind,
    RoDeviceInfo,
    BrsInvalid,
    StdlibArgument,
} from "../brsTypes";
import { Interpreter } from "../interpreter";

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
]);
