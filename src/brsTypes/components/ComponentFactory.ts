import { RoSGNode, Group, LayoutGroup, Rectangle, Label, Font, Poster } from "..";

export enum BrsComponentName {
    Node = "Node",
    Group = "Group",
    LayoutGroup = "LayoutGroup",
    Rectangle = "Rectangle",
    Label = "Label",
    Font = "Font",
    Poster = "Poster",
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
            default:
                return;
        }
    }
}
