import { RoSGNode, Group, Rectangle, Label } from "..";

export enum BrsComponentName {
    Node = "Node",
    Group = "Group",
    Rectangle = "Rectangle",
    Label = "Label",
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
            case BrsComponentName.Node:
                return new RoSGNode([], name);
            case BrsComponentName.Rectangle:
                return new Rectangle([], name);
            case BrsComponentName.Label:
                return new Label([], name);
            default:
                return;
        }
    }
}
