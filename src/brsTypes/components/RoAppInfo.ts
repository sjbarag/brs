import { BrsBoolean, BrsString, BrsValue, ValueKind } from "../BrsType";
import { BrsComponent } from "./BrsComponent";
import { BrsType } from "..";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import * as PP from "../../preprocessor";

export class RoAppInfo extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;

    private readonly manifest = PP.getManifestSync(process.cwd());

    constructor() {
        super("roAppInfo");

        this.registerMethods({
            ifAppInfo: [
                this.getID,
                this.isDev,
                this.getVersion,
                this.getTitle,
                this.getSubtitle,
                this.getDevID,
                this.getValue,
            ],
        });
    }

    toString(parent?: BrsType) {
        return "<Component: roAppInfo>";
    }

    equalTo(other: BrsType) {
        return BrsBoolean.False;
    }

    /**
     * Originally returns the app's channel ID or 'dev' for sideloaded applications.
     * @returns {string} - 'dev'
     */
    private getID = new Callable("getID", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            return new BrsString("dev");
        },
    });

    /**
     * Returns true if the application is sideloaded, i.e. the channel ID is "dev".
     * @returns {boolean} - true
     */
    private isDev = new Callable("isDev", {
        signature: {
            args: [],
            returns: ValueKind.Boolean,
        },
        impl: (interpreter: Interpreter) => {
            return BrsBoolean.True;
        },
    });

    private getVersion = new Callable("getVersion", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            let manifest = this.manifest;

            let version = ["major_version", "minor_version", "build_version"]
                .map((key) => manifest.get(key))
                .filter((key) => !!key)
                .join(".");
            version = version !== "" ? version : "..";

            return new BrsString(version);
        },
    });

    private getTitle = new Callable("getTitle", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            let title = this.manifest.get("title");

            return title !== undefined ? new BrsString(title.toString()) : new BrsString("");
        },
    });

    private getSubtitle = new Callable("getSubtitle", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            let subtitle = this.manifest.get("subtitle");

            return subtitle !== undefined ? new BrsString(subtitle.toString()) : new BrsString("");
        },
    });

    /**
     * Returns the app's developer ID, or the keyed developer ID, if the application is sideloaded.
     * @returns {string} - "34c6fceca75e456f25e7e99531e2425c6c1de443" (default value for sideloaded channels)
     */
    private getDevID = new Callable("getDevID", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            // return default value for sideloaded channels
            return new BrsString("34c6fceca75e456f25e7e99531e2425c6c1de443");
        },
    });

    /**
     * Returns the named manifest value, or an empty string if the entry is does not exist.
     */
    private getValue = new Callable("getValue", {
        signature: {
            args: [new StdlibArgument("key", ValueKind.String)],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter, key: BrsString) => {
            let value = this.manifest.get(key.value);

            return value !== undefined ? new BrsString(value.toString()) : new BrsString("");
        },
    });
}
