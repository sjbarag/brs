import { BrsValue, ValueKind, BrsString, BrsBoolean, BrsInvalid, Comparable } from "../BrsType";
import { BrsType, isBrsString, isBrsNumber, isBrsBoolean } from "..";
import { BrsComponent, BrsIterable } from "./BrsComponent";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { Int32 } from "../Int32";
import { RoAssociativeArray } from "./RoAssociativeArray";

/**
 * Gives the order for sorting different types in a mixed array
 *
 * Mixed Arrays seem to get sorted in this order (tested with Roku OS 9.4):
 *
 * numbers in numeric order
 * strings in alphabetical order,
 * assocArrays in original order
 * everything else in original order
 */
function getTypeSortIndex(a: BrsType): number {
    if (isBrsNumber(a)) {
        return 0;
    } else if (isBrsString(a)) {
        return 1;
    } else if (a instanceof RoAssociativeArray) {
        return 2;
    }
    return 3;
}

function sortCompare(
    a: BrsType,
    b: BrsType,
    caseInsensitive: boolean = false,
    sortInsideTypes = true
): number {
    let compare = 0;
    if (a !== undefined && b !== undefined) {
        const aSortOrder = getTypeSortIndex(a);
        const bSortOrder = getTypeSortIndex(b);
        if (aSortOrder < bSortOrder) {
            compare = -1;
        } else if (bSortOrder < aSortOrder) {
            compare = 1;
        } else {
            // a and b have the same type
            if (sortInsideTypes && isBrsNumber(a)) {
                // two numbers are in numeric order
                compare = (a as Comparable).greaterThan(b).toBoolean() ? 1 : -1;
            } else if (sortInsideTypes && isBrsString(a)) {
                // two strings are in alphabetical order
                let aStr = a.toString();
                let bStr = b.toString();
                if (caseInsensitive) {
                    aStr = aStr.toLowerCase();
                    bStr = bStr.toLowerCase();
                }
                // roku does not use locale for sorting strings
                compare = aStr > bStr ? 1 : -1;
            } else {
                // for everything else, return in original array order
                compare = 0;
            }
        }
    }
    return compare;
}

export class RoArray extends BrsComponent implements BrsValue, BrsIterable {
    readonly kind = ValueKind.Object;
    private elements: BrsType[];

    constructor(elements: BrsType[]) {
        super("roArray");
        this.elements = elements;
        this.registerMethods({
            ifArray: [
                this.peek,
                this.pop,
                this.push,
                this.shift,
                this.unshift,
                this.delete,
                this.count,
                this.clear,
                this.append,
            ],
            ifArrayJoin: [this.join],
            ifArraySort: [this.sort, this.sortBy, this.reverse],
            ifEnum: [this.isEmpty],
        });
    }

    toString(parent?: BrsType): string {
        if (parent) {
            return "<Component: roArray>";
        }

        return [
            "<Component: roArray> =",
            "[",
            ...this.elements.map((el: BrsValue) => `    ${el.toString(this)}`),
            "]",
        ].join("\n");
    }

    equalTo(other: BrsType) {
        return BrsBoolean.False;
    }

    getValue() {
        return this.elements;
    }

    getElements() {
        return this.elements.slice();
    }

    get(index: BrsType) {
        switch (index.kind) {
            case ValueKind.Int32:
                return this.getElements()[index.getValue()] || BrsInvalid.Instance;
            case ValueKind.String:
                return this.getMethod(index.value) || BrsInvalid.Instance;
            default:
                throw new Error(
                    "Array indexes must be 32-bit integers, or method names must be strings"
                );
        }
    }

    set(index: BrsType, value: BrsType) {
        if (index.kind !== ValueKind.Int32) {
            throw new Error("Array indexes must be 32-bit integers");
        }

        this.elements[index.getValue()] = value;

        return BrsInvalid.Instance;
    }

    private peek = new Callable("peek", {
        signature: {
            args: [],
            returns: ValueKind.Dynamic,
        },
        impl: (interpreter: Interpreter) => {
            return this.elements[this.elements.length - 1] || BrsInvalid.Instance;
        },
    });

    private pop = new Callable("pop", {
        signature: {
            args: [],
            returns: ValueKind.Dynamic,
        },
        impl: (interpreter: Interpreter) => {
            return this.elements.pop() || BrsInvalid.Instance;
        },
    });

    private push = new Callable("push", {
        signature: {
            args: [new StdlibArgument("talue", ValueKind.Dynamic)],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter, tvalue: BrsType) => {
            this.elements.push(tvalue);
            return BrsInvalid.Instance;
        },
    });

    private shift = new Callable("shift", {
        signature: {
            args: [],
            returns: ValueKind.Dynamic,
        },
        impl: (interpreter: Interpreter) => {
            return this.elements.shift() || BrsInvalid.Instance;
        },
    });

    private unshift = new Callable("unshift", {
        signature: {
            args: [new StdlibArgument("tvalue", ValueKind.Dynamic)],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter, tvalue: BrsType) => {
            this.elements.unshift(tvalue);
            return BrsInvalid.Instance;
        },
    });

    private delete = new Callable("delete", {
        signature: {
            args: [new StdlibArgument("index", ValueKind.Int32)],
            returns: ValueKind.Boolean,
        },
        impl: (interpreter: Interpreter, index: Int32) => {
            if (index.lessThan(new Int32(0)).toBoolean()) {
                return BrsBoolean.False;
            }

            let deleted = this.elements.splice(index.getValue(), 1);
            return BrsBoolean.from(deleted.length > 0);
        },
    });

    private count = new Callable("count", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (interpreter: Interpreter) => {
            return new Int32(this.elements.length);
        },
    });

    private clear = new Callable("clear", {
        signature: {
            args: [],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter) => {
            this.elements = [];
            return BrsInvalid.Instance;
        },
    });

    private append = new Callable("append", {
        signature: {
            args: [new StdlibArgument("array", ValueKind.Object)],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter, array: BrsComponent) => {
            if (!(array instanceof RoArray)) {
                // TODO: validate against RBI
                return BrsInvalid.Instance;
            }

            this.elements = [
                ...this.elements,
                ...array.elements.filter((element) => !!element), // don't copy "holes" where no value exists
            ];

            return BrsInvalid.Instance;
        },
    });
    // ifArrayJoin
    private join = new Callable("join", {
        signature: {
            args: [new StdlibArgument("separator", ValueKind.String)],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter, separator: BrsString) => {
            if (
                this.elements.some(function (element) {
                    return !(element instanceof BrsString);
                })
            ) {
                interpreter.stderr.write("roArray.Join: Array contains non-string value(s).\n");
                return new BrsString("");
            }
            return new BrsString(this.elements.join(separator.value));
        },
    });
    // ifArraySort
    private sort = new Callable("sort", {
        signature: {
            args: [new StdlibArgument("flags", ValueKind.String, new BrsString(""))],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter, flags: BrsString) => {
            if (flags.toString().match(/([^ir])/g) != null) {
                interpreter.stderr.write("roArray.Sort: Flags contains invalid option(s).\n");
            } else {
                const caseInsensitive = flags.toString().indexOf("i") > -1;
                this.elements = this.elements.sort(function (a, b) {
                    return sortCompare(a, b, caseInsensitive);
                });
                if (flags.toString().indexOf("r") > -1) {
                    this.elements = this.elements.reverse();
                }
            }
            return BrsInvalid.Instance;
        },
    });

    private sortBy = new Callable("sortBy", {
        signature: {
            args: [
                new StdlibArgument("fieldName", ValueKind.String),
                new StdlibArgument("flags", ValueKind.String, new BrsString("")),
            ],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter, fieldName: BrsString, flags: BrsString) => {
            if (flags.toString().match(/([^ir])/g) != null) {
                interpreter.stderr.write("roArray.SortBy: Flags contains invalid option(s).\n");
            } else {
                const caseInsensitive = flags.toString().indexOf("i") > -1;
                this.elements = this.elements.sort(function (a, b) {
                    var compare = 0;
                    if (a instanceof RoAssociativeArray && b instanceof RoAssociativeArray) {
                        let aHasField = a.elements.has(fieldName.toString().toLowerCase()),
                            bHasField = b.elements.has(fieldName.toString().toLowerCase());
                        if (aHasField && bHasField) {
                            var valueA = a.get(fieldName);
                            var valueB = b.get(fieldName);
                            compare = sortCompare(valueA, valueB, caseInsensitive);
                        } else if (aHasField) {
                            // assocArray with fields come before assocArrays without
                            compare = -1;
                        } else if (bHasField) {
                            // assocArray with fields come before assocArrays without
                            compare = 1;
                        }
                    } else if (a !== undefined && b !== undefined) {
                        compare = sortCompare(a, b, false, false);
                    }
                    return compare;
                });
                if (flags.toString().indexOf("r") > -1) {
                    this.elements = this.elements.reverse();
                }
            }
            return BrsInvalid.Instance;
        },
    });

    private reverse = new Callable("reverse", {
        signature: {
            args: [],
            returns: ValueKind.Void,
        },
        impl: (interpreter: Interpreter, separator: BrsString) => {
            this.elements = this.elements.reverse();
            return BrsInvalid.Instance;
        },
    });
    // ifEnum
    private isEmpty = new Callable("isEmpty", {
        signature: {
            args: [],
            returns: ValueKind.Boolean,
        },
        impl: (interpreter: Interpreter) => {
            return BrsBoolean.from(this.elements.length === 0);
        },
    });
}
