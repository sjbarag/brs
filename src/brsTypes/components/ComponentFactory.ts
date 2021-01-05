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
    MiniKeyboard,
    TextEditBox,
    BrsComponent,
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
    MiniKeyboard = "MiniKeyboard",
    TextEditBox = "TextEditBox",
}

// TODO: update with more components as they're implemented.
export class ComponentFactory {
    private static additionalComponents = new Map<string, (name: string) => RoSGNode>();

    /**
     * Adds additional components types to the factory, so other software can extend brs if necessary.
     * This would allow other software using this to add other node/component types at runtime
     * For example, adding custom implementations of the built-in types, or
     * adding additional types (PinPad, BusySpinner, etc) that aren't here yet
     *
     * @static
     * @param types Array of pairs of [componentTypeName, construction function], such that when a given componentType is requested, the construction function is called and returns one of those components
     */
    public static addComponentTypes(types: [string, (name: string) => RoSGNode][]) {
        types.forEach(([componentType, ctor]) => {
            this.additionalComponents.set(componentType.toLowerCase(), ctor);
        });
    }

    public static createComponent(
        componentType: BrsComponentName | string,
        componentName?: string
    ): RoSGNode | undefined {
        let name = componentName || componentType;
        const additionalCtor = this.additionalComponents.get(componentType?.toLowerCase());
        if (additionalCtor) {
            return additionalCtor(name);
        }
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
            case BrsComponentName.MiniKeyboard:
                return new MiniKeyboard([], name);
            case BrsComponentName.TextEditBox:
                return new TextEditBox([], name);
            default:
                return;
        }
    }

    /**
     * Checks to see if the given component type can be resolved by the Factory
     * That is, if it is a built in type or has been added at run time.
     *
     * @static
     * @param componentType The name of component to resolve
     * @returns {boolean} true if that type is resolvable/constructable, false otherwise
     */
    public static canResolveComponentType(componentType: BrsComponentName | string): boolean {
        return (
            this.additionalComponents.has(componentType?.toLowerCase()) ||
            componentType in BrsComponentName
        );
    }
}
