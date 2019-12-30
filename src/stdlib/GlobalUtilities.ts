import {
    Callable,
    ValueKind,
    BrsInvalid,
    BrsString,
    BrsType,
    StdlibArgument,
    RoAssociativeArray,
} from "../brsTypes";

let warningShown = false;

export const RebootSystem = new Callable("RebootSystem", {
    signature: {
        args: [],
        returns: ValueKind.Void,
    },
    impl: () => {
        if (!warningShown) {
            console.warn("`RebootSystem` is not implemented in `brs`.");
            warningShown = true;
        }

        return BrsInvalid.Instance;
    },
});

export const GetInterface = new Callable("GetInterface", {});
