import { RoAssociativeArray } from "./RoAssociativeArray";
import { RoArray } from "./RoArray";
import { BrsComponent } from "./BrsComponent";
import { BrsBoolean, BrsString, BrsValue, ValueKind } from "../BrsType";
import { BrsType } from "..";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { XmlDocument, XmlElement } from "xmldoc";

export class RoXMLElement extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;
    private xmlNode?: XmlElement;

    constructor() {
        super("roXMLElement");

        this.registerMethods({
            ifXMLElement: [this.parse, this.getName, this.getNamedElementsCi, this.getAttributes],
        });
    }

    toString(parent?: BrsType) {
        return "<Component: roXMLElement>";
    }

    equalTo(other: BrsType) {
        return BrsBoolean.False;
    }

    private parse = new Callable("parse", {
        signature: {
            args: [new StdlibArgument("str", ValueKind.String)],
            returns: ValueKind.Boolean,
        },
        impl: (interpreter: Interpreter, str: BrsString) => {
            try {
                this.xmlNode = new XmlDocument(str.value);
                return BrsBoolean.True;
            } catch (err) {
                this.xmlNode = undefined;
                return BrsBoolean.False;
            }
        },
    });

    private getName = new Callable("getName", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            return new BrsString(this.xmlNode?.name ?? "");
        },
    });

    private getNamedElementsCi = new Callable("getNamedElementsCi", {
        signature: {
            args: [new StdlibArgument("str", ValueKind.String)],
            returns: ValueKind.Object,
        },
        impl: (interpreter: Interpreter, str: BrsString) => {
            let neededKey = str.value.toLowerCase();
            let arr = [];
            for (let item of this.xmlNode?.children ?? []) {
                if (item.type === "element" && item.name?.toLowerCase() === neededKey) {
                    let childXmlElement = new RoXMLElement();
                    childXmlElement.xmlNode = item;
                    arr.push(childXmlElement);
                }
            }
            return new RoArray(arr);
        },
    });

    private getAttributes = new Callable("getAttributes", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (interpreter: Interpreter) => {
            let attrs = this.xmlNode?.attr ?? {};
            return new RoAssociativeArray(
                Object.entries(attrs).map(([name, value]) => ({
                    name: new BrsString(name),
                    value: new BrsString(value),
                }))
            );
        },
    });
}
