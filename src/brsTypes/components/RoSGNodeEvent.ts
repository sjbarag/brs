import { BrsComponent } from "./BrsComponent";
import { ValueKind, BrsString, BrsValue, BrsBoolean } from "../BrsType";
import { Callable } from "../Callable";
import { Interpreter } from "../../interpreter";
import { RoSGNode, Field } from "./RoSGNode";
import { BrsType } from "..";

export class RoSGNodeEvent extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;

    constructor(
        readonly node: RoSGNode,
        readonly fieldName: BrsString,
        readonly fieldValue: BrsType
    ) {
        super("roSGNodeEvent");
        this.appendMethods([this.getdata, this.getfield, this.getrosgnode, this.getnode]);
    }

    equalTo(other: BrsType) {
        // RBI doesn't allow events to be compared.
        return BrsBoolean.False;
    }

    toString() {
        return "<Component: roSGNodeEvent>";
    }

    /** Retrieves the new field value at the time of the change. */
    private getdata = new Callable("getdata", {
        signature: {
            args: [],
            returns: ValueKind.Dynamic,
        },
        impl: (interpreter: Interpreter) => {
            return this.fieldValue;
        },
    });

    /** Retrieves the name of the field that changed. */
    private getfield = new Callable("getfield", {
        signature: {
            args: [],
            returns: ValueKind.Dynamic,
        },
        impl: (interpreter: Interpreter) => {
            return this.fieldName;
        },
    });

    /** Retrieves a pointer to the node. This can be used for nodes without an ID. */
    private getrosgnode = new Callable("getrosgnode", {
        signature: {
            args: [],
            returns: ValueKind.Dynamic,
        },
        impl: (interpreter: Interpreter) => {
            return this.node;
        },
    });

    /** Retrieves the ID of the node that changed. */
    private getnode = new Callable("getnode", {
        signature: {
            args: [],
            returns: ValueKind.Dynamic,
        },
        impl: (interpreter: Interpreter) => {
            return this.node.get(new BrsString("id"));
        },
    });
}
