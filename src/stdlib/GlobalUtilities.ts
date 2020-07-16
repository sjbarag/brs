import {
    Callable,
    ValueKind,
    BrsInvalid,
    BrsString,
    BrsType,
    StdlibArgument,
    RoAssociativeArray,
    BrsInterface,
} from "../brsTypes";
import { BrsComponent } from "../brsTypes/components/BrsComponent";

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

export const GetInterface = new Callable("GetInterface", {
    signature: {
        args: [
            new StdlibArgument("object", ValueKind.Object),
            new StdlibArgument("ifname", ValueKind.String),
        ],
        returns: ValueKind.Interface,
    },
    impl: (interpreter, object: BrsComponent, ifname: BrsString): BrsInterface | BrsInvalid => {
        return object.interfaces.get(ifname.value.toLowerCase()) || BrsInvalid.Instance;
    },
});

export const FindMemberFunction = new Callable("FindMemberFunction", {
    signature: {
        args: [
            new StdlibArgument("object", ValueKind.Object),
            new StdlibArgument("funname", ValueKind.String),
        ],
        returns: ValueKind.Interface,
    },
    impl: (interpreter, object: BrsComponent, funName: BrsString): BrsInterface | BrsInvalid => {
        let iface: BrsType = BrsInvalid.Instance;
        object.interfaces.forEach((interfaceName) => {
            if (interfaceName.methodNames.has(funName.value.toLowerCase())) {
                iface = interfaceName;
            }
        });

        return iface;
    },
});
