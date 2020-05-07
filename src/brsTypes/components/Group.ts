import { RoSGNode } from "./RoSGNode";
import { AAMember } from "./RoAssociativeArray";

export class Group extends RoSGNode {
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

    constructor(members: AAMember[] = [], readonly name: string = "Group") {
        super(members, name);
        this.registerFields(this.builtInFields);
    }
}
