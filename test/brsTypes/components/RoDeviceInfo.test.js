const brs = require("brs");
const {
    RoDeviceInfo,
    RoAssociativeArray,
    RoSGNode,
    RoArray,
    BrsBoolean,
    BrsString,
    Int32,
    BrsInvalid,
    ValueKind,
} = brs.types;
const { Interpreter } = require("../../../lib/interpreter");

describe("RoDeviceInfo", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    describe("comparisons", () => {
        it("is equal to nothing", () => {
            let a = new RoDeviceInfo();
            expect(a.equalTo(a)).toBe(BrsBoolean.False);
        });
    });

    describe("stringification", () => {
        it("lists stringified value", () => {
            let deviceInfo = new RoDeviceInfo();
            expect(deviceInfo.toString()).toEqual(`<Component: roDeviceInfo>`);
        });
    });

    describe("methods", () => {
        beforeEach(() => {
            interpreter = new Interpreter();
        });

        describe("getModel", () => {
            it("should return a fake model number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getModel");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getModelDisplayName", () => {
            it("should return a fake model display name", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getModelDisplayName");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getModelType", () => {
            it("should return a fake model type", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getModelType");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getModelDetails", () => {
            it("should return a fake model's details", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getModelDetails");

                let aa = method.call(interpreter);

                expect(method).toBeTruthy();
            });
        });
        describe("getFriendlyName", () => {
            it("should return a fake friendly name ", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getFriendlyName");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getOSVersion", () => {
            it("should return a fake OS version", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getOSVersion");

                let aa = method.call(interpreter);
                let items = aa.getMethod("items");
                let result = items.call(interpreter);

                expect(method).toBeTruthy();
                expect(items).toBeTruthy();
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });
        describe("getVersion", () => {
            it("should return a fake version number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getVersion");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getRIDA", () => {
            it("should return a fake RIDA", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getRIDA");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("isRIDADisabled", () => {
            it("should return true when disabling RIDA", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("isRIDADisabled");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(BrsBoolean.True);
            });
        });
        describe("getChannelClientId", () => {
            it("should get fake channel client id", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getChannelClientId");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getUserCountryCode", () => {
            it("should return a user's country code from local environment", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getUserCountryCode");

                process.env.LOCALE = "en_US";

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("en_US"));
            });
        });
        describe("getRandomUUID", () => {
            it("should return a random UUID", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getRandomUUID");

                let uuid = method.call(interpreter);
                expect(method).toBeTruthy();
                expect(uuid).toBeTruthy();
            });
        });
        describe("getTimeZone", () => {
            it("should return current time zone from local environment", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getTimeZone");

                process.env.TZ = "PST";

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("PST"));
            });
        });
        describe("hasFeature", () => {
            it("should return true when enabling hasFeature flag", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("hasFeature");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, new BrsString("on"))).toEqual(BrsBoolean.False);
            });
        });
        describe("getCurrentLocale", () => {
            it("should locale settings from local environment", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getCurrentLocale");

                process.env.LOCALE = "en_US";

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("en_US"));
            });
        });
        describe("getCountryCode", () => {
            it("should return country code from local environment", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getCountryCode");

                process.env.LOCALE = "en_US";

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("en_US"));
            });
        });
        describe("getPreferredCaptionLanguage", () => {
            it("should return preferred caption language", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getPreferredCaptionLanguage");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("timeSinceLastKeyPress", () => {
            it("should return time since last key press value", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("timeSinceLastKeyPress");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new Int32(0));
            });
        });
        describe("getDrmInfo", () => {
            it("should return fake drm info", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDrmInfo");

                let aa = method.call(interpreter);
                let items = aa.getMethod("items");
                let result = items.call(interpreter);

                expect(method).toBeTruthy();
                expect(items).toBeTruthy();
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });
        describe("getDrmInfoEx", () => {
            it("should return fake drm info ex", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDrmInfoEx");

                let aa = method.call(interpreter);
                let items = aa.getMethod("items");
                let result = items.call(interpreter);

                expect(method).toBeTruthy();
                expect(items).toBeTruthy();
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });
        describe("getCaptionsMode", () => {
            it("should fake captions mode setting to on", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getCaptionsMode");
                let setCapMethod = deviceInfo.getMethod("setCaptionsMode");

                setCapMethod.call(interpreter, new BrsString("on"));

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("on"));
            });
        });
        describe("setCaptionsMode", () => {
            it("should set fake captions mode to true", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("setCaptionsMode");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, new BrsString("on"))).toEqual(BrsBoolean.True);
            });
        });
        describe("getCaptionsOption", () => {
            it("should return a model number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getCaptionsOption");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, new BrsString("on"))).toEqual(new BrsString("on"));
            });
        });
        describe("getClockFormat", () => {
            it("should return fake clock format", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getClockFormat");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("enableAppFocusEvent", () => {
            it("should notify that event nofiication has been enabled", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableAppFocusEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(BrsBoolean.True);
            });
        });
        describe("enableScreensaverExitedEvent", () => {
            it("should enable screensaver exited event", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableScreensaverExitedEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(BrsBoolean.True);
            });
        });
        describe("enableLowGeneralMemoryEvent", () => {
            it("should enable low memory event", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableLowGeneralMemoryEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(BrsBoolean.True);
            });
        });
        describe("getGeneralMemoryLevel", () => {
            it("return general memory level", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getGeneralMemoryLevel");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("isStoreDemoMode", () => {
            it("should enable store demo mode to true", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("isStoreDemoMode");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(BrsBoolean.False);
            });
        });
        describe("getLinkStatus", () => {
            it("should enable link status to true", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getLinkStatus");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(BrsBoolean.True);
            });
        });
        describe("enableLinkStatusEvent", () => {
            it("should return a model number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableLinkStatusEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(BrsBoolean.True);
            });
        });
        describe("getConnectionType", () => {
            it("should return a fake connection type", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getConnectionType");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getExternalIp", () => {
            it("should return a fake external ip address", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getExternalIp");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getIPAddrs", () => {
            it("should return a model number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getIPAddrs");

                let aa = method.call(interpreter);
                let items = aa.getMethod("items");
                let result = items.call(interpreter);

                expect(method).toBeTruthy();
                expect(items).toBeTruthy();
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });
        describe("getConnectionInfo", () => {
            it("should return connection info map", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getConnectionInfo");

                let aa = method.call(interpreter);
                let items = aa.getMethod("items");
                let result = items.call(interpreter);

                expect(method).toBeTruthy();
                expect(items).toBeTruthy();
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });
        describe("getDisplayType", () => {
            it("should return fake display type", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDisplayType");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getDisplayMode", () => {
            it("should return fake display mode", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDisplayMode");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getDisplayAspectRatio", () => {
            it("should return a model number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDisplayAspectRatio");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getDisplaySize", () => {
            it("should return fake display size", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDisplaySize");
                let aa = method.call(interpreter);
                let items = aa.getMethod("items");
                let result = items.call(interpreter);

                expect(method).toBeTruthy();
                expect(items).toBeTruthy();
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });
        describe("getVideoMode", () => {
            it("should return a fake video mode spec.", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getVideoMode");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getDisplayProperties", () => {
            it("should return fake display width and height", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDisplayProperties");

                let aa = method.call(interpreter);
                let items = aa.getMethod("items");
                let result = items.call(interpreter);

                expect(method).toBeTruthy();
                expect(items).toBeTruthy();
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });
        describe("getSupportedGraphicsResolutions", () => {
            it("should return fake supported gfx resolution info.", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getSupportedGraphicsResolutions");
                let aa = method.call(interpreter);
                let items = aa.getMethod("items");
                let result = items.call(interpreter);

                expect(method).toBeTruthy();
                expect(items).toBeTruthy();
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });
        describe("canDecodeVideo", () => {
            it("return fake decoded video info", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("canDecodeVideo");
                let config = new RoAssociativeArray([
                    { name: new BrsString("video_format"), value: new BrsString("") },
                ]);
                let aa = method.call(interpreter, config);
                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("result"))).toEqual(BrsBoolean.True);
                expect(aa.get(new BrsString("codec"))).toEqual(new BrsString("mpeg4 avc"));
            });
        });
        describe("getUIResolution", () => {
            it("should return fake ui resolution info.", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getUIResolution");
                let aa = method.call(interpreter);
                let items = aa.getMethod("items");
                let result = items.call(interpreter);

                expect(method).toBeTruthy();
                expect(items).toBeTruthy();
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });

        describe("getGraphicsPlatform", () => {
            it("should return fake gfx platform name", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getGraphicsPlatform");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getModel", () => {
            it("should return a model number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getModel");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("enableCodecCapChangedEvent", () => {
            it("should enable codec cap changed event", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableCodecCapChangedEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(BrsBoolean.True);
            });
        });
        describe("getAudioOutputChannel", () => {
            it("should return fake audio output channel", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getAudioOutputChannel");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("getAudioDecoderInfo", () => {
            it("should return fake audio decoder info", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getAudioDecoderInfo");
                let aa = method.call(interpreter);
                let items = aa.getMethod("items");
                let result = items.call(interpreter);

                expect(method).toBeTruthy();
                expect(items).toBeTruthy();
                expect(result.elements).toEqual(new RoArray([]).elements);
            });
        });
        describe("getSoundEffectsVolume", () => {
            it("should return a fake sound effect volume", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getSoundEffectsVolume");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new Int32(0));
            });
        });
        describe("isAudioGuideEnabled", () => {
            it("should enable audio guide", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("isAudioGuideEnabled");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(""));
            });
        });
        describe("enableAudioGuideChangedEvent", () => {
            it("should return true when enabling audio guide change event", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableAudioGuideChangedEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(BrsBoolean.True);
            });
        });
    });
});
