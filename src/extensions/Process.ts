import { RoAssociativeArray, BrsString, RoArray } from "../brsTypes";

export const Process = new RoAssociativeArray([
    {
        name: new BrsString("argv"),
        value: new RoArray(process.argv.map(arg => new BrsString(arg))),
    },
]);
