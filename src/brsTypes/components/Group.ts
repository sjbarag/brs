import { RoSGNode } from "./RoSGNode";
import { ValueKind } from "../BrsType";
import { AAMember } from "./RoAssociativeArray";

export type RenderTracking = "none" | "partial" | "full";
export type ChildRenderOrder = "renderFirst" | "renderLast";

export class Group extends RoSGNode {
    readonly kind = ValueKind.Object;

    static readonly builtInFields = [
        { name: "visible", type: "boolean" },
        { name: "opacity", type: "float" },
        { name: "translation", type: "array" }, // 2D Vector [0.0, 0.0]
        { name: "rotation", type: "float" },
        { name: "scale", type: "array" }, // 2D Vector [0.0, 0.0]
        { name: "scaleRotateCenter", type: "array" }, // 2D Vector [0.0, 0.0]
        { name: "childRenderOrder", type: "string" }, // ChildRenderOrder
        { name: "inheritParentTransform", type: "boolean" },
        { name: "inheritParentOpacity", type: "boolean" },
        { name: "clippingRect", type: "array" }, // [0.0, 0.0, 0.0, 0.0]
        { name: "renderPass", type: "integer" },
        { name: "muteAudioGuide", type: "boolean" },
        { name: "enableRenderTracking", type: "boolean" },
        { name: "renderTracking", type: "string" }, // RenderTracking
    ];

    constructor(members: AAMember[] = []) {
        super(members, "Group", Group.builtInFields);
    }
}
