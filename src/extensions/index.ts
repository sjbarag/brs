import { RoAssociativeArray, BrsString, mGlobal } from "../brsTypes";
import { mockComponent } from "./mockComponent";
import { mockFunction } from "./mockFunction";
import { mockComponentPartial } from "./mockComponentPartial";
import { RunInScope } from "./RunInScope";
import { Process } from "./Process";
import {
    resetMocks,
    resetMockComponents,
    resetMockFunctions,
    resetMockComponent,
    resetMockFunction,
} from "./resetMocks";
import { triggerKeyEvent } from "./triggerKeyEvent";
import { GetStackTrace } from "./GetStackTrace";

export const _brs_ = new RoAssociativeArray([
    { name: new BrsString("mockComponent"), value: mockComponent },
    { name: new BrsString("mockFunction"), value: mockFunction },
    { name: new BrsString("mockComponentPartial"), value: mockComponentPartial },
    { name: new BrsString("resetMocks"), value: resetMocks },
    { name: new BrsString("resetMockComponents"), value: resetMockComponents },
    { name: new BrsString("resetMockComponent"), value: resetMockComponent },
    { name: new BrsString("resetMockFunctions"), value: resetMockFunctions },
    { name: new BrsString("resetMockFunction"), value: resetMockFunction },
    { name: new BrsString("runInScope"), value: RunInScope },
    { name: new BrsString("process"), value: Process },
    { name: new BrsString("global"), value: mGlobal },
    { name: new BrsString("testData"), value: new RoAssociativeArray([]) },
    { name: new BrsString("triggerKeyEvent"), value: triggerKeyEvent },
    { name: new BrsString("getStackTrace"), value: GetStackTrace },
]);

/** resets _brs_.testData values to `{}` in brightscript representation */
export function resetTestData() {
    _brs_.set(new BrsString("testData"), new RoAssociativeArray([]));
}
