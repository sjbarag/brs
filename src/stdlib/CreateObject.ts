import {
    Callable,
    ValueKind,
    BrsInvalid,
    BrsString,
    BrsType,
    StdlibArgument,
    RoAssociativeArray,
} from "../brsTypes";
import { BrsObjects } from "../brsTypes/components/BrsObjects";
import { Interpreter } from "../interpreter";
import { MockNode } from "../extensions/MockNode";

const AdditionalBrsObjects = new Map<string, Function>();

/**
 * Lets another software using BRS as a library to add/overwrite an implementation of a BrsObject.
 * This is useful, for example, if another piece of software wanted to implement video playback or Draw2d functionality
 *
 * @export
 * @param {string} name - the name of the BrsObject (e.g. "roScreen", etc.)
 * @param {Function} ctor  - a function (interpreter, ...additionalArgs) that returns a new object
 */
export function AddAdditionalBrsObject(name: string, ctor: Function): void {
    AdditionalBrsObjects.set(name.toLowerCase(), ctor);
}

/** Creates a new instance of a given brightscript component (e.g. roAssociativeArray) */
export const CreateObject = new Callable("CreateObject", {
    signature: {
        args: [
            new StdlibArgument("objName", ValueKind.String),
            new StdlibArgument("arg1", ValueKind.Dynamic, BrsInvalid.Instance),
            new StdlibArgument("arg2", ValueKind.Dynamic, BrsInvalid.Instance),
            new StdlibArgument("arg3", ValueKind.Dynamic, BrsInvalid.Instance),
            new StdlibArgument("arg4", ValueKind.Dynamic, BrsInvalid.Instance),
            new StdlibArgument("arg5", ValueKind.Dynamic, BrsInvalid.Instance),
        ],
        returns: ValueKind.Dynamic,
    },
    impl: (interpreter: Interpreter, objName: BrsString, ...additionalArgs: BrsType[]) => {
        let objToMock = objName.value.toLowerCase();

        if (
            objToMock === "rosgnode" &&
            additionalArgs[0] &&
            !(additionalArgs[0] instanceof BrsInvalid)
        ) {
            objToMock = additionalArgs[0].toString();
        }

        let possibleMock = interpreter.environment.getMockObject(objToMock.toLowerCase());
        if (possibleMock instanceof RoAssociativeArray) {
            return new MockNode(possibleMock, objToMock);
        }
        const objNameLookup = objName.value.toLowerCase();

        let ctor = AdditionalBrsObjects.get(objNameLookup) || BrsObjects.get(objNameLookup);

        return ctor ? ctor(interpreter, ...additionalArgs) : BrsInvalid.Instance;
    },
});
