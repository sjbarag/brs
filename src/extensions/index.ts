import { RoAssociativeArray, BrsString, mGlobal } from "../brsTypes";
import { mockComponent } from "./mockComponent";
import { mockFunction } from "./mockFunction";
import { mockFunctions } from "./mockFunctions";
import { RunInScope } from "./RunInScope";
import { Process } from "./Process";
import { resetMocks, resetMockComponents, resetMockFunctions } from "./resetMocks";

export const _brs_ = new RoAssociativeArray([
    { name: new BrsString("mockComponent"), value: mockComponent },
    { name: new BrsString("mockFunction"), value: mockFunction },
    { name: new BrsString("mockFunctions"), value: mockFunctions },
    { name: new BrsString("mockComponentPartial"), value: mockComponentPartial },
    { name: new BrsString("resetMocks"), value: resetMocks },
    { name: new BrsString("resetMockComponents"), value: resetMockComponents },
    { name: new BrsString("resetMockFunctions"), value: resetMockFunctions },
    { name: new BrsString("runInScope"), value: RunInScope },
    { name: new BrsString("process"), value: Process },
    { name: new BrsString("global"), value: mGlobal },
]);
