# Statements
* [try/catch/throw](https://developer.roku.com/docs/references/brightscript/language/error-handling.md)
* [goto](https://developer.roku.com/docs/references/brightscript/language/program-statements.md#goto-label)
* [end](https://developer.roku.com/docs/references/brightscript/language/program-statements.md#end)
* [stop](https://developer.roku.com/docs/references/brightscript/language/program-statements.md#stop) and the associated interactive debugger

# Global Functions
* [Eval](https://developer.roku.com/docs/references/brightscript/language/runtime-functions.md#evalcode-as-string-as-dynamic) - deprecated in RBI and will not be implemented in `brs`
* [GetLastRunCompileError](https://developer.roku.com/docs/references/brightscript/language/runtime-functions.md#getlastruncompileerror-as-object) - compile errors are reported immediately
* [GetLastRunRuntimeError](https://developer.roku.com/docs/references/brightscript/language/runtime-functions.md#getlastrunruntimeerror-as-integer) - runtime errors are reported immediately
* [RunGarbageCollector](https://developer.roku.com/docs/references/brightscript/language/global-utility-functions.md#rungarbagecollector-as-object)
* [Sleep](https://developer.roku.com/docs/references/brightscript/language/global-utility-functions.md#sleepmilliseconds-as-integer-as-void)
* [Wait](https://developer.roku.com/docs/references/brightscript/language/global-utility-functions.md#waittimeout-as-integer-port-as-object-as-object) - requires `roMessagePort` to be implemented (see below)
* [UpTime](https://developer.roku.com/docs/references/brightscript/language/global-utility-functions.md#uptimedummy-as-integer-as-float)

# BrightScript Components
The following components are not currently implemented in `brs`, meaning that they can't be instantiated via `createObject`.  They may be implemented in the future

* [roAppInfo](https://developer.roku.com/docs/references/brightscript/components/roappinfo.md)
* [roAppManager](https://developer.roku.com/docs/references/brightscript/components/roappmanager.md)
* [roAudioGuide](https://developer.roku.com/docs/references/brightscript/components/roaudioguide.md)
* [roAudioMetadata](https://developer.roku.com/docs/references/brightscript/components/roaudioguide.md)
* [roAudioPlayer](https://developer.roku.com/docs/references/brightscript/components/roaudioplayer.md)
* [roAudioResource](https://developer.roku.com/docs/references/brightscript/components/roaudioresource.md)
* [roBitmap](https://developer.roku.com/docs/references/brightscript/components/robitmap.md)
* [roByteArray](https://developer.roku.com/docs/references/brightscript/components/robytearray.md)
* [roChannelStore](https://developer.roku.com/docs/references/brightscript/components/rochannelstore.md)
* [roCompositor](https://developer.roku.com/docs/references/brightscript/components/rocompositor.md)
* [roDataGramSocket](https://developer.roku.com/docs/references/brightscript/components/rodatagramsocket.md)
* [roDeviceCrypto](https://developer.roku.com/docs/references/brightscript/components/rodevicecrypto.md)
* [roEVPCipher](https://developer.roku.com/docs/references/brightscript/components/roevpcipher.md)
* [roEVPDigest](https://developer.roku.com/docs/references/brightscript/components/roevpdigest.md)
* [roEVPDigest](https://developer.roku.com/docs/references/brightscript/components/roevpdigest.md)
* [roFileSystem](https://developer.roku.com/docs/references/brightscript/components/rofilesystem.md)
* [roFileSystem](https://developer.roku.com/docs/references/brightscript/components/rofilesystem.md)
* [roFont](https://developer.roku.com/docs/references/brightscript/components/rofont.md)
* [roFontRegistry](https://developer.roku.com/docs/references/brightscript/components/rofontregistry.md)
* [roFunction](https://developer.roku.com/docs/references/brightscript/components/rofunction.md)
* [roHdmiStatus](https://developer.roku.com/docs/references/brightscript/components/rohdmistatus.md)
* [roHMAC](https://developer.roku.com/docs/references/brightscript/components/rohmac.md)
* [roHttpAgent](https://developer.roku.com/docs/references/brightscript/components/rohttpagent.md)
* [roHttpAgent](https://developer.roku.com/docs/references/brightscript/components/rohttpagent.md)
* [roImageMetadata](https://developer.roku.com/docs/references/brightscript/components/roimagemetadata.md)
* [roInput](https://developer.roku.com/docs/references/brightscript/components/roinput.md)
* [roList](https://developer.roku.com/docs/references/brightscript/components/rolist.md)
* [roLocalization](https://developer.roku.com/docs/references/brightscript/components/rolocalization.md)
* [roLongInteger](https://developer.roku.com/docs/references/brightscript/components/rolonginteger.md)
* [roMessagePort](https://developer.roku.com/docs/references/brightscript/components/romessageport.md)
* [roMicrophone](https://developer.roku.com/docs/references/brightscript/components/romicrophone.md)
* [roPath](https://developer.roku.com/docs/references/brightscript/components/ropath.md)
* [roProgramGuide](https://developer.roku.com/docs/references/brightscript/components/roprogramguide.md)
* [roRegion](https://developer.roku.com/docs/references/brightscript/components/roregion.md)
* [roRegistry](https://developer.roku.com/docs/references/brightscript/components/roregistry.md)
* [roRegistrySection](https://developer.roku.com/docs/references/brightscript/components/roregistrysection.md)
* [roRSA](https://developer.roku.com/docs/references/brightscript/components/rorsa.md)
* [roScreen](https://developer.roku.com/docs/references/brightscript/components/roscreen.md)
* [roSGScreen](https://developer.roku.com/docs/references/brightscript/components/rosgscreen.md)
* [roSocketAddress](https://developer.roku.com/docs/references/brightscript/components/rosocketaddress.md)
* [roSpringboardScreen](https://developer.roku.com/docs/references/brightscript/components/rospringboardscreen.md)
* [roSprite](https://developer.roku.com/docs/references/brightscript/components/rosprite.md)
* [roStreamSocket](https://developer.roku.com/docs/references/brightscript/components/rostreamsocket.md)
* [roSystemLog](https://developer.roku.com/docs/references/brightscript/components/rosystemlog.md)
* [roTextToSpeech](https://developer.roku.com/docs/references/brightscript/components/rotexttospeech.md)
* [roTextureManager](https://developer.roku.com/docs/references/brightscript/components/rotexturemanager.md)
* [roTextureRequest](https://developer.roku.com/docs/references/brightscript/components/rotexturerequest.md)
* [roUrlTransfer](https://developer.roku.com/docs/references/brightscript/components/rourltransfer.md)
* [roVideoPlayer](https://developer.roku.com/docs/references/brightscript/components/rovideoplayer.md)
* [roXMLElement](https://developer.roku.com/docs/references/brightscript/components/roxmlelement.md)
* [roXMLList](https://developer.roku.com/docs/references/brightscript/components/roxmllist.md)

## Deprecated in RBI
The following components are deprecated in the Reference BrightScript Interpreter (RBI), and thus will not be implemented in this project.

* [roCaptionRenderer](https://developer.roku.com/docs/references/brightscript/components/robytearray.md)
* [roCodeRegistrationScreen](https://developer.roku.com/docs/references/brightscript/components/rocoderegistrationscreen.md)
* [roFontMetrics](https://developer.roku.com/docs/references/brightscript/components/rofontmetrics.md)
* [roGridScreen](https://developer.roku.com/docs/references/brightscript/components/rogridscreen.md)
* [roImageCanvas](https://developer.roku.com/docs/references/brightscript/components/roimagecanvas.md)
* [roKeyboardScreen](https://developer.roku.com/docs/references/brightscript/components/rokeyboardscreen.md)
* [roListScreen](https://developer.roku.com/docs/references/brightscript/components/rolistscreen.md)
* [roMessageDialog](https://developer.roku.com/docs/references/brightscript/components/romessagedialog.md)
* [roOneLineDialog](https://developer.roku.com/docs/references/brightscript/components/roonelinedialog.md)
* [roParagraphScreen](https://developer.roku.com/docs/references/brightscript/components/roparagraphscreen.md)
* [roPinEntryDialog](https://developer.roku.com/docs/references/brightscript/components/ropinentrydialog.md)
* [roPosterScreen](https://developer.roku.com/docs/references/brightscript/components/roposterscreen.md)
* [roSearchHistory](https://developer.roku.com/docs/references/brightscript/components/rosearchhistory.md)
* [roSearchHistory](https://developer.roku.com/docs/references/brightscript/components/rosearchhistory.md)
* [roSlideShow](https://developer.roku.com/docs/references/brightscript/components/roslideshow.md)
* [roTextScreen](https://developer.roku.com/docs/references/brightscript/components/rotextscreen.md)
* [roVideoScreen](https://developer.roku.com/docs/references/brightscript/components/rovideoscreen.md)

# SceneGraph
Custom SceneGraph components (defined in XML files) are supported, but with a few caveats:

1. The entire chain of `extends="..."` components must be implemented by `brs` or custom nodes.  A missing standard-library node will result in a partially-created component that likely won't function properly.
2. BrightScript included in a [CDATA](https://en.wikipedia.org/wiki/CDATA) tag is ignored.

Additionally, many components are implemented as "stubs" - their fields exist and are of the correct type, but assigning values to them doesn't trigger any effects (e.g. assigning a string to a `Label`'s `.text` field doesn't change the resulting `.boundingRect()`).  This is intentional for now, as some components are either very complex (e.g. `MarkupGrid`) or would be prohibitively expensive to make accurate (e.g. font rendering nuances that affect layout, wrapping, etc.).  Given that `brs` doesn't intend to implement any sort of graphical rendering, implementing some SceneGraph components as non-stubs would lead to near-meaningless components (what's it mean for an `Video` component to exist if it doesn't play video, advance progress, buffer, etc.?).

| Name | Status | Notes |
| ---- | ------ | ----- |
| [AnimationBase](https://developer.roku.com/docs/references/scenegraph/abstract-nodes/animationbase.md) | ⛔ None | Includes all subclasses |
| [Animation](https://developer.roku.com/docs/references/scenegraph/animation-nodes/animation.md) | ⛔ None | Extends `AnimationBase` |
| [ArrayGrid](https://developer.roku.com/docs/references/scenegraph/abstract-nodes/arraygrid.md) | ⚠ Stub | |
| [Audio](https://developer.roku.com/docs/references/scenegraph/media-playback-nodes/audio.md) | ⛔ None | |
| [BusySpinner](https://developer.roku.com/docs/references/scenegraph/widget-nodes/busyspinner.md) | ⛔ None | |
| [ButtonGroup](https://developer.roku.com/docs/references/scenegraph/layout-group-nodes/buttongroup.md) | ⛔ None | |
| [Button](https://developer.roku.com/docs/references/scenegraph/widget-nodes/button.md) | ⛔ None | |
| [ChannelStore](https://developer.roku.com/docs/references/scenegraph/control-nodes/channelstore.md) | ⛔ None | |
| [CheckList](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/checklist.md) | ⛔ None | |
| [ColorFieldInterpolator](https://developer.roku.com/docs/references/scenegraph/animation-nodes/colorfieldinterpolator.md) | ⛔ None | Extends `AnimationBase` |
| [ComponentLibrary](https://developer.roku.com/docs/references/scenegraph/control-nodes/componentlibrary.md) | ⚠ Partial | `pkg:/`-local libraries only (as `.zip` files) |
| [ContentNode](https://developer.roku.com/docs/references/scenegraph/control-nodes/contentnode.md) | ✅ Complete | |
| [Dialog](https://developer.roku.com/docs/references/scenegraph/dialog-nodes/dialog.md) | ⛔ None | |
| [FloatFieldInterpolator](https://developer.roku.com/docs/references/scenegraph/animation-nodes/floatfieldinterpolator.md) | ⛔ None | Extends `AnimationBase` |
| [Font](https://developer.roku.com/docs/references/scenegraph/typographic-nodes/font.md) | ⚠ Stub | |
| [GridPanel](https://developer.roku.com/docs/references/scenegraph/sliding-panels-nodes/gridpanel.md) | ⛔ None | |
| [Group](https://developer.roku.com/docs/references/scenegraph/layout-group-nodes/group.md) | ⚠ Partial | Fields can be set, but `renderTracking` never gets updated (because nothing renders) |
| [KeyboardDialog](https://developer.roku.com/docs/references/scenegraph/dialog-nodes/keyboarddialog.md) | ⛔ None | Extends `Dialog` |
| [Keyboard](https://developer.roku.com/docs/references/scenegraph/widget-nodes/keyboard.md) | ⛔ None | |
| [LabelList](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/labellist.md) | ⛔ None | |
| [Label](https://developer.roku.com/docs/references/scenegraph/renderable-nodes/label.md) | ⚠ Stub | |
| [LayoutGroup](https://developer.roku.com/docs/references/scenegraph/layout-group-nodes/layoutgroup.md) | ⚠ Stub | |
| [ListPanel](https://developer.roku.com/docs/references/scenegraph/sliding-panels-nodes/listpanel.md) | ⛔ None | |
| [MarkupGrid](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/markupgrid.md) | ⚠ Stub | Assigning `ContentNode` to `.content` field doesn't create items |
| [MarkupList](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/markuplist.md) | ⛔ None | |
| [MaskGroup](https://developer.roku.com/docs/references/scenegraph/control-nodes/maskgroup.md) | ⛔ None | |
| [MiniKeyboard](https://developer.roku.com/docs/references/scenegraph/widget-nodes/minikeyboard.md) | ⚠ Stub | |
| [Node](https://developer.roku.com/docs/references/scenegraph/abstract-nodes/node.md) | ✅ Mostly complete | Some interfaces may not be accurate (e.g. `ifSGNodeBoundingRect`) |
| [OverhangPanelSetScene](https://developer.roku.com/docs/references/scenegraph/sliding-panels-nodes/overhangpanelsetscene.md) | ⛔ None | |
| [Overhang](https://developer.roku.com/docs/references/scenegraph/sliding-panels-nodes/overhang.md) | ⛔ None | |
| [PanelSet](https://developer.roku.com/docs/references/scenegraph/sliding-panels-nodes/panelset.md) | ⛔ None | |
| [Panel](https://developer.roku.com/docs/references/scenegraph/sliding-panels-nodes/panel.md) | ⛔ None | |
| [ParallelAnimation](https://developer.roku.com/docs/references/scenegraph/animation-nodes/parallelanimation.md) | ⛔ None | Extends `AnimationBase` |
| [ParentalControlPinpad](https://developer.roku.com/docs/references/scenegraph/widget-nodes/parentalcontrolpinpad.md) | ⛔ None | |
| [PinDialog](https://developer.roku.com/docs/references/scenegraph/dialog-nodes/pindialog.md) | ⛔ None | Extends `Dialog` |
| [Pinpad](https://developer.roku.com/docs/references/scenegraph/widget-nodes/pinpad.md) | ⛔ None | |
| [PosterGrid](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/postergrid.md) | ⛔ None | |
| [Poster](https://developer.roku.com/docs/references/scenegraph/renderable-nodes/poster.md) ⚠ Stub | Does not fetch images |
| [ProgressDialog](https://developer.roku.com/docs/references/scenegraph/dialog-nodes/progressdialog.md) | ⛔ None | Extends `Dialog` |
| [RadioButtonList](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/radiobuttonlist.md) | ⛔ None | |
| [Rectangle](https://developer.roku.com/docs/references/scenegraph/renderable-nodes/rectangle.md) | ⚠ Stub | |
| [RowList](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/rowlist.md) | ⛔ None | |
| [Scene](https://developer.roku.com/docs/references/scenegraph/abstract-nodes/scene.md) | ⚠ Stub | |
| [ScrollableText](https://developer.roku.com/docs/references/scenegraph/typographic-nodes/scrollabletext.md) | ⛔ None | |
| [ScrollingLabel](https://developer.roku.com/docs/references/scenegraph/typographic-nodes/scrollinglabel.md) | ⛔ None | |
| [SequentialAnimation](https://developer.roku.com/docs/references/scenegraph/animation-nodes/sequentialanimation.md) | ⛔ None | Extends `AnimationBase` |
| [SimpleLabel](https://developer.roku.com/docs/references/scenegraph/renderable-nodes/simplelabel.md) | ⛔ None | |
| [SoundEffect](https://developer.roku.com/docs/references/scenegraph/media-playback-nodes/soundeffect.md) | ⛔ None | |
| [TargetGroup](https://developer.roku.com/docs/references/scenegraph/layout-group-nodes/targetgroup.md) | ⚠ Stub | |
| [TargetList](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/targetlist.md) | ⛔ None | |
| [TargetSet](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/targetset.md) | ⛔ None | |
| [Task](https://developer.roku.com/docs/references/scenegraph/control-nodes/task.md) | ⛔ None | |
| [TextEditBox](https://developer.roku.com/docs/references/scenegraph/widget-nodes/texteditbox.md) | ⚠ Stub | |
| [TimeGrid](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/timegrid.md) | ⛔ None | |
| [Timer](https://developer.roku.com/docs/references/scenegraph/control-nodes/timer.md) | ⚠ Stub | |
| [Vector2DFieldInterpolator](https://developer.roku.com/docs/references/scenegraph/animation-nodes/vector2dfieldinterpolator.md) | ⛔ None | Extends `AnimationBase` |
| [Video](https://developer.roku.com/docs/references/scenegraph/media-playback-nodes/video.md) | ⛔ None | |
| [ZoomRowList](https://developer.roku.com/docs/references/scenegraph/list-and-grid-nodes/zoomrowlist.md) | ⛔ None | |
