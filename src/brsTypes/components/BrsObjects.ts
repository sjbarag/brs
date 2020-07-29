import { RoAssociativeArray } from "./RoAssociativeArray";
import { RoDeviceInfo } from "./RoDeviceInfo";
import { RoArray } from "./RoArray";
import { RoDateTime } from "./RoDateTime";
import { Timespan } from "./Timespan";
import { createNodeByType } from "./RoSGNode";
import { RoRegex } from "./RoRegex";
import { BrsString, BrsBoolean } from "../BrsType";
import { RoString } from "./RoString";
import { roBoolean } from "./RoBoolean";
import { roDouble } from "./RoDouble";
import { roFloat } from "./RoFloat";
import { roInt } from "./RoInt";
import { Double } from "../Double";
import { Float } from "../Float";
import { Int32 } from "../Int32";
import { Interpreter } from "../../interpreter";
import { roInvalid } from "./RoInvalid";

/** Map containing a list of brightscript components that can be created. */
export const BrsObjects = new Map<string, Function>([
    ["roassociativearray", (_: Interpreter) => new RoAssociativeArray([])],
    ["roarray", (_: Interpreter) => new RoArray([])],
    ["rodatetime", (_: Interpreter) => new RoDateTime()],
    ["rotimespan", (_: Interpreter) => new Timespan()],
    ["rodeviceinfo", (_: Interpreter) => new RoDeviceInfo()],
    [
        "rosgnode",
        (interpreter: Interpreter, nodeType: BrsString) => createNodeByType(interpreter, nodeType),
    ],
    [
        "roregex",
        (_: Interpreter, expression: BrsString, flags: BrsString) => new RoRegex(expression, flags),
    ],
    ["rostring", (_: Interpreter, literal: BrsString) => new RoString(literal)],
    ["roboolean", (_: Interpreter, literal: BrsBoolean) => new roBoolean(literal)],
    ["rodouble", (_: Interpreter, literal: Double) => new roDouble(literal)],
    ["rofloat", (_: Interpreter, literal: Float) => new roFloat(literal)],
    ["roint", (_: Interpreter, literal: Int32) => new roInt(literal)],
    ["roinvalid", (_: Interpreter) => new roInvalid()],
]);
