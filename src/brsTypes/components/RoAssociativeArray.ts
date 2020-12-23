import { BrsValue, ValueKind, BrsString, BrsBoolean, BrsInvalid } from "../BrsType";
import { BrsComponent, BrsIterable } from "./BrsComponent";
import { BrsType } from "..";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { Int32 } from "../Int32";
import { RoArray } from "./RoArray";

/** A member of an `AssociativeArray` in BrightScript. */
export interface AAMember {
    /** The member's name. */
    name: BrsString;
    /** The value associated with `name`. */
    value: BrsType;
}

export class RoAssociativeArray extends BrsComponent implements BrsValue, BrsIterable {
    readonly kind = ValueKind.Object;
    elements = new Map<string, BrsType>();
    private modeCaseSensitive: boolean = false;

    constructor(elements: AAMember[]) {
        super("roAssociativeArray");
        elements.forEach((member) =>
            this.elements.set(member.name.value.toLowerCase(), member.value)
        );

        this.registerMethods({
            ifAssociativeArray: [
                this.clear,
                this.delete,
                this.addreplace,
                this.count,
                this.doesexist,
                this.append,
                this.keys,
                this.items,
                this.lookup,
                this.setmodecasesensitive,
            ],
            ifEnum: [this.isEmpty],
        });
    }

    toString(parent?: BrsType): string {
        if (parent) {
            return "<Component: roAssociativeArray>";
        }

        return [
            "<Component: roAssociativeArray> =",
            "{",
            ...Array.from(this.elements.entries()).map(
                ([key, value]) => `    ${key}: ${value.toString(this)}`
            ),
            "}",
        ].join("\n");
    }

    equalTo(other: BrsType) {
        return BrsBoolean.False;
    }

    getValue() {
        return this.elements;
    }

    getElements() {
        return Array.from(this.elements.keys())
            .sort()
            .map((key) => new BrsString(key));
    }

    getValues() {
        return Array.from(this.elements.values())
            .sort()
            .map((value: BrsType) => value);
    }

    get(index: BrsType) {
        if (index.kind !== ValueKind.String) {
            throw new Error("Associative array indexes must be strings");
        }

        // TODO: this works for now, in that a property with the same name as a method essentially
        // overwrites the method. The only reason this doesn't work is that getting a method from an
        // associative array and _not_ calling it returns `invalid`, but calling it returns the
        // function itself. I'm not entirely sure why yet, but it's gotta have something to do with
        // how methods are implemented within RBI.
        //
        // Are they stored separately from elements, like they are here? Or does
        // `Interpreter#visitCall` need to check for `invalid` in its callable, then try to find a
        // method with the desired name separately? That last bit would work but it's pretty gross.
        // That'd allow roArrays to have methods with the methods not accessible via `arr["count"]`.
        // Same with RoAssociativeArrays I guess.
        let indexValue = this.modeCaseSensitive ? index.value : index.value.toLowerCase();
        return this.elements.get(indexValue) || this.getMethod(index.value) || BrsInvalid.Instance;
    }

    set(index: BrsType, value: BrsType) {
        if (index.kind !== ValueKind.String) {
            throw new Error("Associative array indexes must be strings");
        }
        let indexValue = this.modeCaseSensitive ? index.value : index.value.toLowerCase();
        this.elements.set(indexValue, value);
        return BrsInvalid.Instance;
    }

    /** Removes all elements from the associative array */
    private clear = new Callable("clear", {
        signature: {
            args: [],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter) => {
            this.elements.clear();
            return BrsInvalid.Instance;
        },
    });

    /** Removes a given item from the associative array */
    private delete = new Callable("delete", {
        signature: {
            args: [new StdlibArgument("str", ValueKind.String)],
            returns: ValueKind.Boolean,
        },
        impl: (interpreter: Interpreter, str: BrsString) => {
            let deleted = this.elements.delete(str.value.toLowerCase());
            return BrsBoolean.from(deleted);
        },
    });

    /** Given a key and value, adds an item to the associative array if it doesn't exist
     * Or replaces the value of a key that already exists in the associative array
     */
    private addreplace = new Callable("addreplace", {
        signature: {
            args: [
                new StdlibArgument("key", ValueKind.String),
                new StdlibArgument("value", ValueKind.Dynamic),
            ],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter, key: BrsString, value: BrsType) => {
            this.set(key, value);
            return BrsInvalid.Instance;
        },
    });

    /** Returns the number of items in the associative array */
    private count = new Callable("count", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (interpreter: Interpreter) => {
            return new Int32(this.elements.size);
        },
    });

    /** Returns a boolean indicating whether or not a given key exists in the associative array */
    private doesexist = new Callable("doesexist", {
        signature: {
            args: [new StdlibArgument("str", ValueKind.String)],
            returns: ValueKind.Boolean,
        },
        impl: (interpreter: Interpreter, str: BrsString) => {
            let strValue = this.modeCaseSensitive ? str.value : str.value.toLowerCase();
            return this.elements.has(strValue) ? BrsBoolean.True : BrsBoolean.False;
        },
    });

    /** Appends a new associative array to another. If two keys are the same, the value of the original AA is replaced with the new one. */
    private append = new Callable("append", {
        signature: {
            args: [new StdlibArgument("obj", ValueKind.Object)],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter, obj: BrsType) => {
            if (!(obj instanceof RoAssociativeArray)) {
                // TODO: validate against RBI
                return BrsInvalid.Instance;
            }

            this.elements = new Map<string, BrsType>([...this.elements, ...obj.elements]);

            return BrsInvalid.Instance;
        },
    });

    /** Returns an array of keys from the associative array in lexicographical order */
    private keys = new Callable("keys", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (interpreter: Interpreter) => {
            return new RoArray(this.getElements());
        },
    });

    /** Returns an array of values from the associative array in lexicographical order */
    private items = new Callable("items", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (interpreter: Interpreter) => {
            return new RoArray(
                this.getElements().map((key: BrsString) => {
                    return new RoAssociativeArray([
                        {
                            name: new BrsString("key"),
                            value: key,
                        },
                        {
                            name: new BrsString("value"),
                            value: this.get(key),
                        },
                    ]);
                })
            );
        },
    });

    /** Given a key, returns the value associated with that key. This method is case insensitive. */
    private lookup = new Callable("lookup", {
        signature: {
            args: [new StdlibArgument("key", ValueKind.String)],
            returns: ValueKind.Dynamic,
        },
        impl: (interpreter: Interpreter, key: BrsString) => {
            let lKey = key.value;
            return this.get(new BrsString(lKey));
        },
    });

    /** Changes the sensitive case method for lookups */
    private setmodecasesensitive = new Callable("setModeCaseSensitive", {
        signature: {
            args: [],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter) => {
            this.modeCaseSensitive = !this.modeCaseSensitive;
            return BrsInvalid.Instance;
        },
    });

    //--------------------------------- ifEnum ---------------------------------

    /** Returns true if enumeration contains no elements, false otherwise	 */
    private isEmpty = new Callable("isEmpty", {
        signature: {
            args: [],
            returns: ValueKind.Boolean,
        },
        impl: (interpreter: Interpreter) => {
            return BrsBoolean.from(this.elements.size === 0);
        },
    });
}
