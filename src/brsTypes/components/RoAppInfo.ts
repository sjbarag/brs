import { BrsBoolean, BrsString, BrsValue, ValueKind } from "../BrsType";
import { BrsComponent } from "./BrsComponent";
import { BrsType } from "..";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";

export class RoAppInfo extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;

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

    /**
     * Returns the conglomerate version number from the manifest, as formatted major_version + minor_version + build_version.
     * @returns {string} - Channel version number. e.g. "1.2.3" or ".." if not available
     */
    private getVersion = new Callable("getVersion", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            let manifest = interpreter.manifest;

            let version = ["major_version", "minor_version", "build_version"]
                .map((key) => manifest.get(key))
                .filter((key) => !!key)
                .join(".");
            version = version !== "" ? version : "..";

            return new BrsString(version);
        },
    });

    /**
     * Returns the title value from the manifest.
     * @returns {string} - title of the channel
     */
    private getTitle = new Callable("getTitle", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            let title = interpreter.manifest.get("title");

            return title != null ? new BrsString(title.toString()) : new BrsString("");
        },
    });

    /**
     * Returns the subtitle value from the manifest.
     * @returns {string} - possible subtitle configuration
     */
    private getSubtitle = new Callable("getSubtitle", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            let subtitle = interpreter.manifest.get("subtitle");

            return subtitle != null ? new BrsString(subtitle.toString()) : new BrsString("");
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
            let value = interpreter.manifest.get(key.value);

            return value != null ? new BrsString(value.toString()) : new BrsString("");
        },
    });
}
