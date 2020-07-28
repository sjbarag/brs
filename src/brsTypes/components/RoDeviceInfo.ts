import { BrsValue, ValueKind, BrsString, BrsBoolean, BrsInvalid } from "../BrsType";
import { BrsType, Int32 } from "..";
import { BrsComponent } from "./BrsComponent";
import { Callable, StdlibArgument } from "../Callable";
import { Interpreter } from "../../interpreter";
import { RoAssociativeArray, AAMember } from "./RoAssociativeArray";

export class RoDeviceInfo extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;

    constructor() {
        super("roDeviceInfo");
        this.registerMethods({
            ifDeviceInfo: [
                this.getModel,
                this.getModelDisplayName,
                this.getModelType,
                this.getModelDetails,
                this.getFriendlyName,
                this.getOSVersion,
                this.getVersion,
                this.getRIDA,
                this.isRIDADisabled,
                this.getChannelClientId,
                this.getUserCountryCode,
                this.getRandomUUID,
                this.getTimeZone,
                this.hasFeature,
                this.getCurrentLocale,
                this.getCountryCode,
                this.getPreferredCaptionLanguage,
                this.timeSinceLastKeyPress,
                this.getDrmInfo,
                this.getDrmInfoEx,
                this.getCaptionsMode,
                this.setCaptionsMode,
                this.getCaptionsOption,
                this.getClockFormat,
                this.enableAppFocusEvent,
                this.enableScreensaverExitedEvent,
                this.enableLowGeneralMemoryEvent,
                this.getGeneralMemoryLevel,
                this.isStoreDemoMode,
                this.getLinkStatus,
                this.enableLinkStatusEvent,
                this.getConnectionType,
                this.getExternalIp,
                this.getIPAddress,
                this.getConnectionInfo,
                this.getDisplayType,
                this.getDisplayMode,
                this.getDisplayAspectRatio,
                this.getDisplaySize,
                this.getVideoMode,
                this.getDisplayProperties,
                this.getSupportedGraphicsResolutions,
                this.canDecodeVideo,
                this.getUIResolution,
                this.getGraphicsPlatform,
                this.enableCodecCapChangedEvent,
                this.getAudioOutputChannel,
                this.getAudioDecoderInfo,
                this.canDecodeAudio,
                this.getSoundEffectsVolume,
                this.isAudioGuideEnabled,
                this.enableAudioGuideChangedEvent,
            ],
        });
    }

    toString(parent?: BrsType): string {
        return "<Component: roDeviceInfo>";
    }

    equalTo(other: BrsType) {
        return BrsBoolean.False;
    }

    private getModel = new Callable("getModel", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("4280x");
        },
    });

    private getModelDisplayName = new Callable("getModelDisplayName", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("Roku 4 XD");
        },
    });

    private getModelType = new Callable("getModelType", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("TV");
        },
    });

    private getModelDetails = new Callable("getModelDetails", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();
            result.push({ name: new BrsString("VendorName"), value: new BrsString("Roku") });
            result.push({ name: new BrsString("ModelNumber"), value: new BrsString("5000x") });
            result.push({ name: new BrsString("VendorUSBName"), value: new BrsString("") });
            result.push({ name: new BrsString("ScreenSize"), value: new BrsString("71") });

            return new RoAssociativeArray(result);
        },
    });

    private getFriendlyName = new Callable("getFriendlyName", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("Roku 5000X, Serial Number: 12121212121212");
        },
    });

    private getOSVersion = new Callable("getOSVersion", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();
            result.push({ name: new BrsString("name"), value: new BrsString("9") });
            result.push({ name: new BrsString("minor"), value: new BrsString("2") });
            result.push({ name: new BrsString("revision"), value: new BrsString("6") });
            result.push({ name: new BrsString("build"), value: new BrsString("4127") });

            return new RoAssociativeArray(result);
        },
    });

    private getVersion = new Callable("getVersion", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("034.08E01185A");
        },
    });

    private getRIDA = new Callable("getRIDA", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("123e4567-e89b-12d3-a456-426655440000");
        },
    });

    private isRIDADisabled = new Callable("isRIDADisabled", {
        signature: {
            args: [],
            returns: ValueKind.Boolean,
        },
        impl: (_interpreter) => {
            return BrsBoolean.True;
        },
    });

    private getChannelClientId = new Callable("getChannelClientId", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("123e4567-e89b-12d3-a456-426655440000");
        },
    });

    private getUserCountryCode = new Callable("getUserCountryCode", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            let countryCode = process.env.LOCALE;
            return countryCode ? new BrsString(countryCode) : BrsInvalid.Instance;
        },
    });

    private getRandomUUID = new Callable("getRandomUUID", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("123e4567-e89b-12d3-a456-426655440000");
        },
    });

    private getTimeZone = new Callable("getTimeZone", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            let timeZone = process.env.TZ;
            return timeZone ? new BrsString(timeZone) : BrsInvalid.Instance;
        },
    });

    private hasFeature = new Callable("hasFeature", {
        signature: {
            args: [new StdlibArgument("feature", ValueKind.String)],
            returns: ValueKind.Boolean,
        },
        impl: (_interpreter) => {
            return BrsBoolean.True;
        },
    });

    private getCurrentLocale = new Callable("getCurrentLocale", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            let locale = process.env.LOCALE;
            return locale ? new BrsString(locale) : BrsInvalid.Instance;
        },
    });

    private getCountryCode = new Callable("getCountryCode", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            let countryCode = process.env.LOCALE;
            return countryCode ? new BrsString(countryCode) : BrsInvalid.Instance;
        },
    });

    private getPreferredCaptionLanguage = new Callable("getPreferredCaptionLanguage", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("eng");
        },
    });

    private timeSinceLastKeyPress = new Callable("timeSinceLastKeyPress", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_interpreter) => {
            return new Int32(360);
        },
    });

    private getDrmInfo = new Callable("getDrmInfo", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();
            result.push({ name: new BrsString("playready"), value: new BrsString("tee;ss") });

            return new RoAssociativeArray(result);
        },
    });

    private getDrmInfoEx = new Callable("getDrmInfoEx", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();
            let subresult = new Array<AAMember>();
            subresult.push({ name: new BrsString("multikey"), value: BrsBoolean.False });
            subresult.push({ name: new BrsString("securestop"), value: BrsBoolean.True });
            subresult.push({ name: new BrsString("tee"), value: BrsBoolean.False });
            subresult.push({ name: new BrsString("version"), value: new Int32(2) });

            result.push({
                name: new BrsString("playready"),
                value: new RoAssociativeArray(subresult),
            });

            return new RoAssociativeArray(result);
        },
    });

    private getCaptionsMode = new Callable("getCaptionsMode", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("On");
        },
    });

    private setCaptionsMode = new Callable("setCaptionsMode", {
        signature: {
            args: [new StdlibArgument("mode", ValueKind.String)],
            returns: ValueKind.Boolean,
        },
        impl: (_interpreter) => {
            return BrsBoolean.True;
        },
    });

    private getCaptionsOption = new Callable("getCaptionsOption", {
        signature: {
            args: [new StdlibArgument("option", ValueKind.String)],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("Default");
        },
    });

    private getClockFormat = new Callable("getClockFormat", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("12h");
        },
    });

    private enableAppFocusEvent = new Callable("enableAppFocusEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter) => {
            return new BrsString("Event notifications are enabled");
        },
    });

    private enableScreensaverExitedEvent = new Callable("enableScreensaverExitedEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter) => {
            return new BrsString("Screen saver exit event notifications are enabled");
        },
    });

    private enableLowGeneralMemoryEvent = new Callable("enableLowGeneralMemoryEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter) => {
            return new BrsString("lowGeneralMemoryLevel event notifications are enabled");
        },
    });

    private getGeneralMemoryLevel = new Callable("getGeneralMemoryLevel", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("normal");
        },
    });

    private isStoreDemoMode = new Callable("isStoreDemoMode", {
        signature: {
            args: [],
            returns: ValueKind.Boolean,
        },
        impl: (_interpreter) => {
            return BrsBoolean.True;
        },
    });

    private getLinkStatus = new Callable("getLinkStatus", {
        signature: {
            args: [],
            returns: ValueKind.Boolean,
        },
        impl: (_interpreter) => {
            return BrsBoolean.True;
        },
    });

    private enableLinkStatusEvent = new Callable("enableLinkStatusEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Boolean,
        },
        impl: (_interpreter) => {
            return BrsBoolean.True;
        },
    });

    private getConnectionType = new Callable("getConnectionType", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("WiFi Connection");
        },
    });

    private getExternalIp = new Callable("getExternalIp", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("192.0.0.101");
        },
    });

    private getIPAddress = new Callable("getIPAddrs", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("network"), value: new BrsString("192.0.0.101") });

            return new RoAssociativeArray(result);
        },
    });

    private getConnectionInfo = new Callable("getConnectionInfo", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("type"), value: new BrsString("WiFi Connection") });
            result.push({
                name: new BrsString("name"),
                value: new BrsString("Connection Interface"),
            });
            result.push({ name: new BrsString("ip"), value: new BrsString("192.0.0.101") });
            result.push({ name: new BrsString("ssid"), value: new BrsString("ssid") });
            result.push({ name: new BrsString("gateway"), value: new BrsString("gateway") });
            result.push({ name: new BrsString("dns.0"), value: new BrsString("dns.0") });
            result.push({ name: new BrsString("dns.1"), value: new BrsString("dns.1") });

            return new RoAssociativeArray(result);
        },
    });

    private getDisplayType = new Callable("getDisplayType", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("HDTV");
        },
    });

    private getDisplayMode = new Callable("getDisplayMode", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("1080p");
        },
    });

    private getDisplayAspectRatio = new Callable("getDisplayAspectRatio", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("16x9");
        },
    });

    private getDisplaySize = new Callable("getDisplaySize", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("w"), value: new BrsString("720") });
            result.push({ name: new BrsString("h"), value: new BrsString("1280") });

            return new RoAssociativeArray(result);
        },
    });

    private getVideoMode = new Callable("getVideoMode", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("1280x720");
        },
    });

    private getDisplayProperties = new Callable("getDisplayProperties", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("Width"), value: new BrsString("120 cm") });
            result.push({ name: new BrsString("Height"), value: new BrsString("120 cm") });

            return new RoAssociativeArray(result);
        },
    });

    private getSupportedGraphicsResolutions = new Callable("getSupportedGraphicsResolutions", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("width"), value: new Int32(2880) });
            result.push({ name: new BrsString("height"), value: new Int32(1880) });
            result.push({ name: new BrsString("name"), value: new BrsString("120 cm") });
            result.push({ name: new BrsString("ui"), value: BrsBoolean.True });
            result.push({ name: new BrsString("preferred"), value: BrsBoolean.True });

            return new RoAssociativeArray(result);
        },
    });

    private canDecodeVideo = new Callable("canDecodeVideo", {
        signature: {
            args: [new StdlibArgument("video_format", ValueKind.Object)],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("result"), value: BrsBoolean.False });
            result.push({ name: new BrsString("updated"), value: new BrsString("level;profile") });
            result.push({ name: new BrsString("codec"), value: new BrsString("mpeg4 avc") });
            result.push({ name: new BrsString("level"), value: new BrsString("4.1") });

            return new RoAssociativeArray(result);
        },
    });

    private getUIResolution = new Callable("getUIResolution", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("name"), value: new BrsString("HD") });
            result.push({ name: new BrsString("width"), value: new BrsString("1920") });
            result.push({ name: new BrsString("height"), value: new BrsString("1080") });

            return new RoAssociativeArray(result);
        },
    });

    private getGraphicsPlatform = new Callable("getGraphicsPlatform", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("opengl");
        },
    });

    private enableCodecCapChangedEvent = new Callable("enableCodecCapChangedEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter) => {
            return new BrsString("Codec event notifications are enabled");
        },
    });

    private getAudioOutputChannel = new Callable("getAudioOutputChannel", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("5.1 surround");
        },
    });

    private getAudioDecoderInfo = new Callable("getAudioDecoderInfo", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("DD+"), value: new BrsString("8:6:0:1") });
            result.push({ name: new BrsString("AC3"), value: new BrsString("8:6:0:1") });
            result.push({ name: new BrsString("DTS"), value: new BrsString("8:6:0:1") });

            return new RoAssociativeArray(result);
        },
    });

    private canDecodeAudio = new Callable("canDecodeAudio", {
        signature: {
            args: [new StdlibArgument("audio_format", ValueKind.Object)],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("canPlayAudioFormat"), value: BrsBoolean.True });

            return new RoAssociativeArray(result);
        },
    });

    private getSoundEffectsVolume = new Callable("getSoundEffectsVolume", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_interpreter) => {
            return new Int32(100);
        },
    });

    private isAudioGuideEnabled = new Callable("isAudioGuideEnabled", {
        signature: {
            args: [],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter) => {
            return new BrsString("Audio guide is enabled");
        },
    });

    private enableAudioGuideChangedEvent = new Callable("enableAudioGuideEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter) => {
            return new BrsString("Audio guide change event notifications are enabled");
        },
    });
}
