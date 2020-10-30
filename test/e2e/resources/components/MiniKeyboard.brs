sub main()
    miniKeyboard = createObject("roSGNode", "MiniKeyboard") 
    print "miniKeyboard node type:" type(miniKeyboard) ' => Node
    print "miniKeyboard node subtype:"miniKeyboard.subtype() ' => MiniKeyboard

    miniKeyboard.text = "hello"
    print "miniKeyboard text:" miniKeyboard.text
    print "miniKeyboard keyColor:" miniKeyboard.keyColor
    print "miniKeyboard focusedKeyColor:" miniKeyboard.focusedKeyColor

    miniKeyboard.keyboardBitmapUri = "/images/somebitmap.bmp"
    miniKeyboard.focusBitmapUri = "/images/somebitmap.bmp"
    print "miniKeyboard keyBitmapUri:" miniKeyboard.keyboardBitmapUri
    print "miniKeyboard focusBitmapUri:" miniKeyboard.focusBitmapUri

    print "miniKeyboard showTextEditBox:" miniKeyboard.showTextEditBox
    print "miniKeyboard lowerCase:" miniKeyboard.lowerCase

    miniKeyboard.textEditBox.text = "hello"
    print "miniKeyboard textEditBox text:" miniKeyboard.textEditBox.text
end sub

