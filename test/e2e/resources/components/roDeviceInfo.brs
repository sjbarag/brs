sub main()
    deviceInfo = createObject("roDeviceInfo")

    print deviceInfo.getModel()
    print deviceInfo.getModelDisplayName()
    print deviceInfo.getModelType()

    modelDetails = deviceInfo.getModelDetails()
    print modelDetails.VendorName
    print modelDetails.ModelNumber
    print modelDetails.VendorUSBName
    print modelDetails.ScreenSize

    print deviceInfo.getFriendlyName()

    deviceOSVersion = deviceInfo.getOSVersion()
    print deviceOSVersion.name
    print deviceOSVersion.minor
    print deviceOSVersion.revision
    print deviceOSVersion.build

    print deviceInfo.getVersion()
    print deviceInfo.getRIDA()
    print deviceInfo.isRIDADisabled()
    print deviceInfo.getChannelClientId()

    print deviceInfo.getUserCountryCode()
    print deviceInfo.getRandomUUID()
    print deviceInfo.getTimeZone()
    print deviceInfo.hasFeature("on")
    print deviceInfo.getCurrentLocale()
    print deviceInfo.getCountryCode()
    print deviceInfo.getPreferredCaptionLanguage()
    print deviceInfo.timeSinceLastKeyPress()
    print deviceInfo.getDrmInfo().playready

    drmInfoEX = deviceInfo.getDrmInfoEx()
    print drmInfoEX.playready.multikey
    print drmInfoEX.playready.securestop
    print drmInfoEX.playready.tee
    print drmInfoEX.playready.version

    print deviceInfo.getCaptionsMode()
    print deviceInfo.setCaptionsMode("on")
    print deviceInfo.getCaptionsOption("default")
    print deviceInfo.getClockFormat()
    print deviceInfo.enableAppFocusEvent(true)
    print deviceInfo.enableScreensaverExitedEvent(true)
    print deviceInfo.enableLowGeneralMemoryEvent(true)
    print deviceInfo.getGeneralMemoryLevel()
    print deviceInfo.isStoreDemoMode()
    print deviceInfo.getLinkStatus()
    print deviceInfo.enableLinkStatusEvent(true)
    print deviceInfo.getConnectionType()
    print deviceInfo.getExternalIp()
    print deviceInfo.getIPAddrs().network

    connectionInfo = deviceInfo.getConnectionInfo()
    print connectionInfo.type
    print connectionInfo.name
    print connectionInfo.ip
    print connectionInfo.ssid
    print connectionInfo.gateway
    print connectionInfo["dns.0"]
    print connectionInfo["dns.1"]

    print deviceInfo.getDisplayType()
    print deviceInfo.getDisplayMode()
    print deviceInfo.getDisplayAspectRatio()

    print deviceInfo.getDisplaySize().w
    print deviceInfo.getDisplaySize().h

    print deviceInfo.getVideoMode()

    print deviceInfo.getDisplayProperties().width
    print deviceInfo.getDisplayProperties().height

    supportedGraphicsReso = deviceInfo.getSupportedGraphicsResolutions()
    print supportedGraphicsReso.width
    print supportedGraphicsReso.height
    print supportedGraphicsReso.name
    print supportedGraphicsReso.ui
    print supportedGraphicsReso.preferred

    decodeVideo = deviceInfo.canDecodeVideo({ "video_codec": { "codec": "mpeg4"}})
    print decodeVideo.result
    print decodeVideo.updated
    print decodeVideo.codec
    print decodeVideo.level

    uiReso = deviceInfo.getUIResolution()
    print uiReso.name
    print uiReso.width
    print uiReso.height

    print deviceInfo.getGraphicsPlatform()
    print deviceInfo.enableCodecCapChangedEvent(true)
    print deviceInfo.getAudioOutputChannel()

    audioDecoderInfo = deviceInfo.getAudioDecoderInfo()
    print audioDecoderInfo["DD+"]
    print audioDecoderInfo["AC3"]
    print audioDecoderInfo["DTS"]

    print deviceInfo.canDecodeAudio({ "audio_format": { "codec": "aac"} }).canPlayAudioFormat
    print deviceInfo.getSoundEffectsVolume()
    print deviceInfo.isAudioGuideEnabled()
    print deviceInfo.enableAudioGuideChangedEvent(true)

end sub