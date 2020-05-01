import { RoSGNode } from "./RoSGNode";
import { ValueKind } from "../BrsType";
import { AAMember } from "./RoAssociativeArray";

export class Group extends RoSGNode {
    readonly kind = ValueKind.Object;

    readonly builtInFields = [
        { name: "visible", type: "boolean" },
        { name: "opacity", type: "float" },
        { name: "translation", type: "array" },
        { name: "rotation", type: "float" },
        { name: "scale", type: "array" },
        { name: "scaleRotateCenter", type: "array" },
        { name: "childRenderOrder", type: "string" },
        { name: "inheritParentTransform", type: "boolean" },
        { name: "inheritParentOpacity", type: "boolean" },
        { name: "clippingRect", type: "array" },
        { name: "renderPass", type: "integer" },
        { name: "muteAudioGuide", type: "boolean" },
        { name: "enableRenderTracking", type: "boolean" },
        { name: "renderTracking", type: "string" },
    ];

    constructor(members: AAMember[] = []) {
        super(members, "Group");
        this.registerFields(this.builtInFields);
    }
}
