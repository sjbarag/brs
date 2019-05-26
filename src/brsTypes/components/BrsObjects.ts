import { RoAssociativeArray } from "./RoAssociativeArray";
import { RoArray } from "./RoArray";
import { Timespan } from "./Timespan";
import { RoRegex } from "./RoRegex";
import { BrsString } from "../BrsType";

/** Map containing a list of brightscript components that can be created. */
export const BrsObjects = {
    roassociativearray: () => new RoAssociativeArray([]),
    roarray: () => new RoArray([]),
    rotimespan: () => new Timespan(),
    roregex: (expression: BrsString, flags: BrsString) => new RoRegex(expression, flags),
};
