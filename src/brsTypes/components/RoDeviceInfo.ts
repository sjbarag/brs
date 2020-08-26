import { BrsValue, ValueKind, BrsString, BrsBoolean, BrsInvalid } from "../BrsType";
import { BrsType, Int32 } from "..";
import { BrsComponent } from "./BrsComponent";
import { Callable, StdlibArgument } from "../Callable";
import { RoAssociativeArray, AAMember } from "./RoAssociativeArray";
import { v4 as uuidv4 } from "uuid";

export class RoDeviceInfo extends BrsComponent implements BrsValue {
    readonly kind = ValueKind.Object;

    private captionsMode = new BrsString("");
    private captionsOption = new BrsString("");
    private enableAppFocus = BrsBoolean.True;
    private enableScreenSaverExited = BrsBoolean.True;
    private enableLowGeneralMemory = BrsBoolean.True;
    private enableLinkStatus = BrsBoolean.True;
    private enableAudioGuideChanged = BrsBoolean.True;
    private enableCodecCapChanged = BrsBoolean.True;

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
                this.getIPAddrs,
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
            return new BrsString("");
        },
    });

    private getModelDisplayName = new Callable("getModelDisplayName", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getModelType = new Callable("getModelType", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getModelDetails = new Callable("getModelDetails", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private getFriendlyName = new Callable("getFriendlyName", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getOSVersion = new Callable("getOSVersion", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private getVersion = new Callable("getVersion", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getRIDA = new Callable("getRIDA", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
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
            return new BrsString("");
        },
    });

    private getUserCountryCode = new Callable("getUserCountryCode", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            let countryCode = process.env.LOCALE;
            return countryCode ? new BrsString(countryCode) : new BrsString("");
        },
    });

    private getRandomUUID = new Callable("getRandomUUID", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            let uuid = uuidv4();
            return new BrsString(uuid);
        },
    });

    private getTimeZone = new Callable("getTimeZone", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            let timeZone = process.env.TZ;
            return timeZone ? new BrsString(timeZone) : new BrsString("");
        },
    });

    private hasFeature = new Callable("hasFeature", {
        signature: {
            args: [new StdlibArgument("feature", ValueKind.String)],
            returns: ValueKind.Boolean,
        },
        impl: (_interpreter) => {
            return BrsBoolean.False;
        },
    });

    private getCurrentLocale = new Callable("getCurrentLocale", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            let locale = process.env.LOCALE;
            return locale ? new BrsString(locale) : new BrsString("");
        },
    });

    private getCountryCode = new Callable("getCountryCode", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            let countryCode = process.env.LOCALE;
            return countryCode ? new BrsString(countryCode) : new BrsString("");
        },
    });

    private getPreferredCaptionLanguage = new Callable("getPreferredCaptionLanguage", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private timeSinceLastKeyPress = new Callable("timeSinceLastKeyPress", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_interpreter) => {
            return new Int32(0);
        },
    });

    private getDrmInfo = new Callable("getDrmInfo", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private getDrmInfoEx = new Callable("getDrmInfoEx", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private getCaptionsMode = new Callable("getCaptionsMode", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return this.captionsMode;
        },
    });

    private setCaptionsMode = new Callable("setCaptionsMode", {
        signature: {
            args: [new StdlibArgument("mode", ValueKind.String)],
            returns: ValueKind.Boolean,
        },
        impl: (_interpreter, mode: BrsString) => {
            this.captionsMode = mode;
            return BrsBoolean.True;
        },
    });

    private getCaptionsOption = new Callable("getCaptionsOption", {
        signature: {
            args: [new StdlibArgument("option", ValueKind.String)],
            returns: ValueKind.String,
        },
        impl: (_interpreter, option: BrsString) => {
            this.captionsOption = option;
            return this.captionsOption;
        },
    });

    private getClockFormat = new Callable("getClockFormat", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private enableAppFocusEvent = new Callable("enableAppFocusEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter, enable: BrsBoolean) => {
            this.enableAppFocus = enable;
            return this.enableAppFocus;
        },
    });

    private enableScreensaverExitedEvent = new Callable("enableScreensaverExitedEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter, enable: BrsBoolean) => {
            this.enableScreenSaverExited = enable;
            return this.enableScreenSaverExited;
        },
    });

    private enableLowGeneralMemoryEvent = new Callable("enableLowGeneralMemoryEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter, enable: BrsBoolean) => {
            this.enableLowGeneralMemory = enable;
            return this.enableLowGeneralMemory;
        },
    });

    private getGeneralMemoryLevel = new Callable("getGeneralMemoryLevel", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private isStoreDemoMode = new Callable("isStoreDemoMode", {
        signature: {
            args: [],
            returns: ValueKind.Boolean,
        },
        impl: (_interpreter) => {
            return BrsBoolean.False;
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
        impl: (_interpreter, enable: BrsBoolean) => {
            this.enableLinkStatus = enable;
            return this.enableLinkStatus;
        },
    });

    private getConnectionType = new Callable("getConnectionType", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getExternalIp = new Callable("getExternalIp", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getIPAddrs = new Callable("getIPAddrs", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private getConnectionInfo = new Callable("getConnectionInfo", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private getDisplayType = new Callable("getDisplayType", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getDisplayMode = new Callable("getDisplayMode", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getDisplayAspectRatio = new Callable("getDisplayAspectRatio", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getDisplaySize = new Callable("getDisplaySize", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private getVideoMode = new Callable("getVideoMode", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getDisplayProperties = new Callable("getDisplayProperties", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private getSupportedGraphicsResolutions = new Callable("getSupportedGraphicsResolutions", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private canDecodeVideo = new Callable("canDecodeVideo", {
        signature: {
            args: [new StdlibArgument("video_format", ValueKind.Object)],
            returns: ValueKind.Object,
        },
        impl: (_interpreter, videoFormat: ValueKind.Object) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("result"), value: BrsBoolean.True });
            result.push({ name: new BrsString("codec"), value: new BrsString("mpeg4 avc") });

            return new RoAssociativeArray(result);
        },
    });

    private getUIResolution = new Callable("getUIResolution", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private getGraphicsPlatform = new Callable("getGraphicsPlatform", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private enableCodecCapChangedEvent = new Callable("enableCodecCapChangedEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter, enable: BrsBoolean) => {
            this.enableCodecCapChanged = enable;
            return this.enableCodecCapChanged;
        },
    });

    private getAudioOutputChannel = new Callable("getAudioOutputChannel", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private getAudioDecoderInfo = new Callable("getAudioDecoderInfo", {
        signature: {
            args: [],
            returns: ValueKind.Object,
        },
        impl: (_interpreter) => {
            return new RoAssociativeArray([]);
        },
    });

    private canDecodeAudio = new Callable("canDecodeAudio", {
        signature: {
            args: [new StdlibArgument("audio_format", ValueKind.Object)],
            returns: ValueKind.Object,
        },
        impl: (_interpreter, audioFormat: ValueKind.Object) => {
            let result = new Array<AAMember>();

            result.push({ name: new BrsString("result"), value: BrsBoolean.True });

            return new RoAssociativeArray(result);
        },
    });

    private getSoundEffectsVolume = new Callable("getSoundEffectsVolume", {
        signature: {
            args: [],
            returns: ValueKind.Int32,
        },
        impl: (_interpreter) => {
            return new Int32(0);
        },
    });

    private isAudioGuideEnabled = new Callable("isAudioGuideEnabled", {
        signature: {
            args: [],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter) => {
            return new BrsString("");
        },
    });

    private enableAudioGuideChangedEvent = new Callable("enableAudioGuideChangedEvent", {
        signature: {
            args: [new StdlibArgument("enable", ValueKind.Boolean)],
            returns: ValueKind.Dynamic,
        },
        impl: (_interpreter, enable: BrsBoolean) => {
            this.enableAudioGuideChanged = enable;
            return this.enableAudioGuideChanged;
        },
    });
}
