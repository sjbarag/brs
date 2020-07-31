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
                expect(method.call(interpreter)).toEqual(new BrsString("4280x"));
            });
        });
        describe("getModelDisplayName", () => {
            it("should return a fake model display name", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getModelDisplayName");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("Roku 4 XD"));
            });
        });
        describe("getModelType", () => {
            it("should return a fake model type", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getModelType");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("TV"));
            });
        });
        describe("getModelDetails", () => {
            it("should return a fake model's details", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getModelDetails");

                let aa = method.call(interpreter);

                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("VendorName"))).toEqual(new BrsString("Roku"));
                expect(aa.get(new BrsString("ModelNumber"))).toEqual(new BrsString("5000x"));
                expect(aa.get(new BrsString("VendorUSBName"))).toEqual(new BrsString(""));
                expect(aa.get(new BrsString("ScreenSize"))).toEqual(new BrsString("71"));
            });
        });
        describe("getFriendlyName", () => {
            it("should return a fake friendly name ", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getFriendlyName");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(
                    new BrsString("Roku 5000X, Serial Number: 12121212121212")
                );
            });
        });
        describe("getOSVersion", () => {
            it("should return a fake OS version", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getOSVersion");

                let aa = method.call(interpreter);

                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("name"))).toEqual(new BrsString("9"));
                expect(aa.get(new BrsString("minor"))).toEqual(new BrsString("2"));
                expect(aa.get(new BrsString("revision"))).toEqual(new BrsString("6"));
                expect(aa.get(new BrsString("build"))).toEqual(new BrsString("4127"));
            });
        });
        describe("getVersion", () => {
            it("should return a fake version number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getVersion");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("034.08E01185A"));
            });
        });
        describe("getRIDA", () => {
            it("should return a fake RIDA", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getRIDA");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(
                    new BrsString("123e4567-e89b-12d3-a456-426655440000")
                );
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
                expect(method.call(interpreter)).toEqual(
                    new BrsString("123e4567-e89b-12d3-a456-426655440000")
                );
            });
        });
        describe("getUserCountryCode", () => {
            it("should return a user's country code from local environment", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getUserCountryCode");

                let countryCode = process.env.LOCALE;

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(countryCode));
            });
        });
        describe("getRandomUUID", () => {
            it("should return a random UUID", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getRandomUUID");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(
                    new BrsString("123e4567-e89b-12d3-a456-426655440000")
                );
            });
        });
        describe("getTimeZone", () => {
            it("should return current time zone from local environment", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getTimeZone");

                let timeZone = process.env.TZ;

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(timeZone));
            });
        });
        describe("hasFeature", () => {
            it("should return true when enabling hasFeature flag", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("hasFeature");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, new BrsString("on"))).toEqual(BrsBoolean.True);
            });
        });
        describe("getCurrentLocale", () => {
            it("should locale settings from local environment", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getCurrentLocale");

                let locale = process.env.LOCALE;

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(locale));
            });
        });
        describe("getCountryCode", () => {
            it("should return country code from local environment", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getCountryCode");

                let cc = process.env.LOCALE;

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString(cc));
            });
        });
        describe("getPreferredCaptionLanguage", () => {
            it("should return preferred caption language", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getPreferredCaptionLanguage");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("eng"));
            });
        });
        describe("timeSinceLastKeyPress", () => {
            it("should return time since last key press value", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("timeSinceLastKeyPress");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new Int32(360));
            });
        });
        describe("getDrmInfo", () => {
            it("should return fake drm info", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDrmInfo");

                let aa = method.call(interpreter);

                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("playready"))).toEqual(new BrsString("tee;ss"));
            });
        });
        describe("getDrmInfoEx", () => {
            it("should return fake drm info ex", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDrmInfoEx");

                let aa = method.call(interpreter);
                let sub = aa.get(new BrsString("playready"));

                expect(method).toBeTruthy();
                expect(sub.get(new BrsString("multikey"))).toEqual(BrsBoolean.False);
                expect(sub.get(new BrsString("securestop"))).toEqual(BrsBoolean.True);
                expect(sub.get(new BrsString("tee"))).toEqual(BrsBoolean.False);
                expect(sub.get(new BrsString("version"))).toEqual(new Int32(2));
            });
        });
        describe("getCaptionsMode", () => {
            it("should fake captions mode setting to on", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getCaptionsMode");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("On"));
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
                expect(method.call(interpreter, new BrsString("default"))).toEqual(
                    new BrsString("Default")
                );
            });
        });
        describe("getClockFormat", () => {
            it("should return fake clock format", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getClockFormat");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("12h"));
            });
        });
        describe("enableAppFocusEvent", () => {
            it("should notify that event nofiication has been enabled", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableAppFocusEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(
                    new BrsString("Event notifications are enabled")
                );
            });
        });
        describe("enableScreensaverExitedEvent", () => {
            it("should enable screensaver exited event", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableScreensaverExitedEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(
                    new BrsString("Screen saver exit event notifications are enabled")
                );
            });
        });
        describe("enableLowGeneralMemoryEvent", () => {
            it("should enable low memory event", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableLowGeneralMemoryEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(
                    new BrsString("lowGeneralMemoryLevel event notifications are enabled")
                );
            });
        });
        describe("getGeneralMemoryLevel", () => {
            it("return general memory level", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getGeneralMemoryLevel");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("normal"));
            });
        });
        describe("isStoreDemoMode", () => {
            it("should enable store demo mode to true", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("isStoreDemoMode");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(BrsBoolean.True);
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
                expect(method.call(interpreter)).toEqual(new BrsString("WiFi Connection"));
            });
        });
        describe("getExternalIp", () => {
            it("should return a fake external ip address", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getExternalIp");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("192.0.0.101"));
            });
        });
        describe("getIPAddrs", () => {
            it("should return a model number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getIPAddrs");

                let aa = method.call(interpreter);

                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("network"))).toEqual(new BrsString("192.0.0.101"));
            });
        });
        describe("getConnectionInfo", () => {
            it("should return connection info map", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getConnectionInfo");

                let aa = method.call(interpreter);

                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("ip"))).toEqual(new BrsString("192.0.0.101"));
                expect(aa.get(new BrsString("ssid"))).toEqual(new BrsString("ssid"));
                expect(aa.get(new BrsString("gateway"))).toEqual(new BrsString("gateway"));
                expect(aa.get(new BrsString("type"))).toEqual(new BrsString("WiFi Connection"));
                expect(aa.get(new BrsString("name"))).toEqual(
                    new BrsString("Connection Interface")
                );
                expect(aa.get(new BrsString("dns.0"))).toEqual(new BrsString("dns.0"));
                expect(aa.get(new BrsString("dns.1"))).toEqual(new BrsString("dns.1"));
            });
        });
        describe("getDisplayType", () => {
            it("should return fake display type", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDisplayType");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("HDTV"));
            });
        });
        describe("getDisplayMode", () => {
            it("should return fake display mode", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDisplayMode");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("1080p"));
            });
        });
        describe("getDisplayAspectRatio", () => {
            it("should return a model number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDisplayAspectRatio");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("16x9"));
            });
        });
        describe("getDisplaySize", () => {
            it("should return fake display size", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDisplaySize");
                let aa = method.call(interpreter);

                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("w"))).toEqual(new BrsString("720"));
                expect(aa.get(new BrsString("h"))).toEqual(new BrsString("1280"));
            });
        });
        describe("getVideoMode", () => {
            it("should return a fake video mode spec.", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getVideoMode");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("1280x720"));
            });
        });
        describe("getDisplayProperties", () => {
            it("should return fake display width and height", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getDisplayProperties");

                let aa = method.call(interpreter);

                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("Width"))).toEqual(new BrsString("1200cm"));
                expect(aa.get(new BrsString("Height"))).toEqual(new BrsString("1200cm"));
            });
        });
        describe("getSupportedGraphicsResolutions", () => {
            it("should return fake supported gfx resolution info.", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getSupportedGraphicsResolutions");

                let aa = method.call(interpreter);

                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("width"))).toEqual(new Int32(2880));
                expect(aa.get(new BrsString("height"))).toEqual(new Int32(1880));
                expect(aa.get(new BrsString("name"))).toEqual(new BrsString("120 cm"));
                expect(aa.get(new BrsString("ui"))).toEqual(BrsBoolean.True);
                expect(aa.get(new BrsString("preferred"))).toEqual(BrsBoolean.True);
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
                expect(aa.get(new BrsString("result"))).toEqual(BrsBoolean.False);
                expect(aa.get(new BrsString("updated"))).toEqual(new BrsString("level;profile"));
                expect(aa.get(new BrsString("codec"))).toEqual(new BrsString("mpeg4 avc"));
                expect(aa.get(new BrsString("level"))).toEqual(new BrsString("4.1"));
            });
        });
        describe("getUIResolution", () => {
            it("should return fake ui resolution info.", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getUIResolution");
                let aa = method.call(interpreter);

                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("name"))).toEqual(new BrsString("HD"));
                expect(aa.get(new BrsString("width"))).toEqual(new BrsString("1920"));
                expect(aa.get(new BrsString("height"))).toEqual(new BrsString("1080"));
            });
        });

        describe("getGraphicsPlatform", () => {
            it("should return fake gfx platform name", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getGraphicsPlatform");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("opengl"));
            });
        });
        describe("getModel", () => {
            it("should return a model number", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getModel");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("4280x"));
            });
        });
        describe("enableCodecCapChangedEvent", () => {
            it("should enable codec cap changed event", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableCodecCapChangedEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(
                    new BrsString("Codec event notifications are enabled")
                );
            });
        });
        describe("getAudioOutputChannel", () => {
            it("should return fake audio output channel", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getAudioOutputChannel");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("5.1 surround"));
            });
        });
        describe("getAudioDecoderInfo", () => {
            it("should return fake audio decoder info", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getAudioDecoderInfo");
                let aa = method.call(interpreter);
                expect(method).toBeTruthy();
                expect(aa.get(new BrsString("DD+"))).toEqual(new BrsString("8:6:0:1"));
                expect(aa.get(new BrsString("AC3"))).toEqual(new BrsString("8:6:0:1"));
                expect(aa.get(new BrsString("DTS"))).toEqual(new BrsString("8:6:0:1"));
            });
        });
        describe("getSoundEffectsVolume", () => {
            it("should return a fake sound effect volume", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("getSoundEffectsVolume");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new Int32(100));
            });
        });
        describe("isAudioGuideEnabled", () => {
            it("should enable audio guide", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("isAudioGuideEnabled");

                expect(method).toBeTruthy();
                expect(method.call(interpreter)).toEqual(new BrsString("Audio guide is enabled"));
            });
        });
        describe("enableAudioGuideChangedEvent", () => {
            it("should return true when enabling audio guide change event", () => {
                let deviceInfo = new RoDeviceInfo();
                let method = deviceInfo.getMethod("enableAudioGuideChangedEvent");

                expect(method).toBeTruthy();
                expect(method.call(interpreter, BrsBoolean.True)).toEqual(
                    new BrsString("Audio guide change event notifications are enabled")
                );
            });
        });
    });
});
