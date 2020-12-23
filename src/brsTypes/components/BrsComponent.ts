import { BrsType } from "..";
import { BrsInvalid, ValueKind, BrsValue } from "../BrsType";
import { Callable } from "../Callable";
import { BrsInterface } from "../BrsInterface";

export class BrsComponent {
    private methods: Map<string, Callable> = new Map<string, Callable>();
    private readonly componentName: string;

    readonly interfaces = new Map<string, BrsInterface>();

    constructor(name: string) {
        this.componentName = name;
    }

    /**
     * Returns the name of the component, used to create instances via `createObject`.
     * @returns the name of this component.
     */
    getComponentName(): string {
        return this.componentName;
    }

    protected registerMethods(interfaces: Record<string, Callable[]>) {
        Object.entries(interfaces).forEach(([interfaceName, methods]) => {
            let interfaceKey = interfaceName.toLowerCase();
            if (!this.interfaces.has(interfaceKey)) {
                this.interfaces.set(interfaceKey, new BrsInterface(interfaceName, methods));
            }

            this.appendMethods(methods);
        });
    }

    /** Appends a method to the component. */
    appendMethod(index: string, method: Callable) {
        this.methods.set(index.toLowerCase(), method);
    }

    /** Given a list of methods, appends all of them to the component. */
    appendMethods(methods: Callable[]) {
        methods.forEach((m) => this.methods.set((m.name || "").toLowerCase(), m));
    }

    getMethod(index: string): Callable | undefined {
        return this.methods.get(index.toLowerCase());
    }
}

/** Represents a BrightScript component that has elements that can be iterated across. */
export interface BrsIterable {
    /**
     * Returns the set of iterable elements contained in this component.
     * @returns an array of elements contained in this component.
     */
    getElements(): ReadonlyArray<BrsType>;

    /**
     * Retrieves an element from this component at the provided `index`.
     * @param index the index in this component from which to retrieve the desired element.
     * @returns the element at `index` if one exists, otherwise throws an Error.
     */
    get(index: BrsType): BrsType;

    set(index: BrsType, value: BrsType): BrsInvalid;
}
