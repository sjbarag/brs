import { RoSGNode, FieldModel } from "./RoSGNode";
import { AAMember } from "./RoAssociativeArray";

export class Font extends RoSGNode {
    readonly defaultFields: FieldModel[] = [
        { name: "uri", type: "uri" },
        { name: "size", type: "integer", value: "1" },
        { name: "fallbackGlyph", type: "string" },
    ];

    constructor(members: AAMember[] = [], readonly name: string = "Font") {
        super([], name);

        this.registerDefaultFields(this.defaultFields);
        this.registerInitializedFields(members);
    }
}
