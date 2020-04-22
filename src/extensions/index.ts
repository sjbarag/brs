import { RoAssociativeArray, BrsString } from "../brsTypes";
import { mockComponent } from "./mockComponent";
import { mockFunction } from "./mockFunction";
import { RunInScope } from "./RunInScope";
import { Process } from "./Process";

export const _brs_ = new RoAssociativeArray([
    { name: new BrsString("mockComponent"), value: mockComponent },
    { name: new BrsString("mockFunction"), value: mockFunction },
    { name: new BrsString("runInScope"), value: RunInScope },
    { name: new BrsString("process"), value: Process },
]);
