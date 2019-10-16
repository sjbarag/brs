import { RoAssociativeArray } from "./RoAssociativeArray";
import { RoArray } from "./RoArray";
import { RoDateTime } from "./RoDateTime";
import { Timespan } from "./Timespan";
import { RoSGNode, createNodeByType } from "./RoSGNode";
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

/** Map containing a list of brightscript components that can be created. */
export const BrsObjects = new Map<string, Function>([
    ["roassociativearray", (interpreter: Interpreter) => new RoAssociativeArray([])],
    ["roarray", (interpreter: Interpreter) => new RoArray([])],
    ["rodatetime", (interpreter: Interpreter) => new RoDateTime()],
    ["rotimespan", (interpreter: Interpreter) => new Timespan()],
    [
        "rosgnode",
        (interpreter: Interpreter, nodeType: BrsString) => createNodeByType(interpreter, nodeType),
    ],
    [
        "roregex",
        (interpreter: Interpreter, expression: BrsString, flags: BrsString) =>
            new RoRegex(expression, flags),
    ],
    ["rostring", (interpreter: Interpreter, literal: BrsString) => new RoString(literal)],
    ["roboolean", (interpreter: Interpreter, literal: BrsBoolean) => new roBoolean(literal)],
    ["rodouble", (interpreter: Interpreter, literal: Double) => new roDouble(literal)],
    ["rofloat", (interpreter: Interpreter, literal: Float) => new roFloat(literal)],
    ["roint", (interpreter: Interpreter, literal: Int32) => new roInt(literal)],
]);
