import { AssociativeArray } from "./AssociativeArray";
import { BrsString } from "../BrsType";

export const BrsObjects = new Map<string, Function>(
    [
        [ "roassociativearray", () => new AssociativeArray([]) ]
    ]
);
