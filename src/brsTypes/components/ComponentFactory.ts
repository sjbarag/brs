import {
    RoSGNode,
    Group,
    LayoutGroup,
    Rectangle,
    Label,
    Font,
    Poster,
    ArrayGrid,
    MarkupGrid,
    ContentNode,
    Timer,
    Scene,
} from "..";

export enum BrsComponentName {
    Node = "Node",
    Group = "Group",
    LayoutGroup = "LayoutGroup",
    Rectangle = "Rectangle",
    Label = "Label",
    Font = "Font",
    Poster = "Poster",
    ArrayGrid = "ArrayGrid",
    MarkupGrid = "MarkupGrid",
    ContentNode = "ContentNode",
    Timer = "Timer",
    Scene = "Scene",
}

// TODO: update with more components as they're implemented.
export class ComponentFactory {
    public static createComponent(
        componentType: BrsComponentName,
        componentName?: string
    ): RoSGNode | undefined {
        let name = componentName || componentType;
        switch (componentType) {
            case BrsComponentName.Group:
                return new Group([], name);
            case BrsComponentName.LayoutGroup:
                return new LayoutGroup([], name);
            case BrsComponentName.Node:
                return new RoSGNode([], name);
            case BrsComponentName.Rectangle:
                return new Rectangle([], name);
            case BrsComponentName.Label:
                return new Label([], name);
            case BrsComponentName.Font:
                return new Font([], name);
            case BrsComponentName.Poster:
                return new Poster([], name);
            case BrsComponentName.ArrayGrid:
                return new ArrayGrid([], name);
            case BrsComponentName.MarkupGrid:
                return new MarkupGrid([], name);
            case BrsComponentName.ContentNode:
                return new ContentNode(name);
            case BrsComponentName.Timer:
                return new Timer([], name);
            case BrsComponentName.Scene:
                return new Scene([], name);
            default:
                return;
        }
    }
}
