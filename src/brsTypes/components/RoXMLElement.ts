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
    private xmlNode?: any;

    constructor() {
        super("roXMLElement");

        this.registerMethods({
            ifXMLEelement: [this.parse, this.getName, this.getNamedElementsCi, this.getAttributes],
        });
    }

    public setXMLElem(xmlElem: XmlElement) {
        this.xmlNode = xmlElem;
        return this;
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
                return BrsBoolean.from(true);
            } catch (err) {
                this.xmlNode = undefined;
                return BrsBoolean.from(false);
            }
        },
    });

    private getName = new Callable("getName", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter, str: BrsString) => {
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
                if (item.name?.toLowerCase() === neededKey) {
                    arr.push(new RoXMLElement().setXMLElem(item));
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
        impl: (interpreter: Interpreter, str: BrsString) => {
            return this.convertObjectToBrsAA(this.xmlNode?.attr ?? {});
        },
    });

    private convertObjectToBrsAA(object_: any) {
        let array = [];
        for (let key in object_) {
            array.push({
                name: new BrsString(key),
                value: new BrsString(object_[key]),
            });
        }
        return new RoAssociativeArray(array);
    }
}
