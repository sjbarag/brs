sub main()
    deviceInfo = createObject("roDeviceInfo")

    print deviceInfo.getModel() ' => 4280x
    print deviceInfo.getModelDisplayName() ' => Roku 4 XD
    print deviceInfo.getModelType() ' => TV

    modelDetails = deviceInfo.getModelDetails()
    print modelDetails.VendorName
    print modelDetails.ModelNumber
    print modelDetails.VendorUSBName
    print modelDetails.ScreenSize

    print deviceInfo.getFriendlyName()

    deviceOSVersion = deviceInfo.getOSVersion()
    print deviceOSVersion.name  ' => 9
    print deviceOSVersion.minor
    print deviceOSVersion.revision
    print deviceOSVersion.build

    print deviceInfo.getVersion() ' => 034.
    print deviceInfo.getRIDA()
    print deviceInfo.isRIDADisabled()
    print deviceInfo.getChannelClientId()

    print deviceInfo.getUserCountryCode()
    print deviceInfo.getRandomUUID()
    print deviceInfo.getTimeZone()
    print deviceInfo.hasFeature()
    print deviceInfo.getCurrentLocale()
    print deviceInfo.getCountryCode()
    print deviceInfo.getPreferredCaptionLanguage()
    print deviceInfo.timeSinceLastKeyPress()
    print deviceInfo.getDrmInfo()
    print deviceInfo.getDrmInfoEx()
    print deviceInfo.getCaptionsMode()
    print deviceInfo.setCaptionsMode()
    print deviceInfo.getCaptionsOption()
    print deviceInfo.getClockFormat()
    print deviceInfo.enableAppFocusEvent()
    print deviceInfo.enableScreensaverExitedEvent()
    print deviceInfo.enableLowGeneralMemoryEvent()
    print deviceInfo.getGeneralMemoryLevel()
    print deviceInfo.isStoreDemoMode()
    print deviceInfo.getLinkStatus()
    print deviceInfo.enableLinkStatusEvent()
    print deviceInfo.getConnectionType()
    print deviceInfo.getExternalIp()
    print deviceInfo.getIPAddress()
    print deviceInfo.getConnectionInfo()
    print deviceInfo.getDisplayType()
    print deviceInfo.getDisplayMode()
    print deviceInfo.getDisplayAspectRatio()
    print deviceInfo.getDisplaySize()
    print deviceInfo.getVideoMode()
    print deviceInfo.getDisplayProperties()
    print deviceInfo.getSupportedGraphicsResolutions()
    print deviceInfo.canDecodeAudio()
    print deviceInfo.getUIResolution()
    print deviceInfo.getGraphicsPlatform()
    print deviceInfo.enableCodecCapChangedEvent()
    print deviceInfo.getAudioOutputChannel()
    print deviceInfo.getAudioDecoderInfo()
    print deviceInfo.canDecodeAudio()
    print deviceInfo.getSoundEffectsVolume()
    print deviceInfo.isAudioGuideEnabled()
    print deviceInfo.enableAudioGuideChangedEvent()

end sub