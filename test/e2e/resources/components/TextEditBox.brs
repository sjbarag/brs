sub main()
    textEditBox = createObject("roSGNode", "TextEditBox")
    print "textEditBox node type:" type(textEditBox) ' => Node
    print "textEditBox node subtype:"textEditBox.subtype() ' => TextEditBox

    textEditBox.text = "hello"
    print "textEditBox text:" textEditBox.text
    print "textEditBox hint text:" textEditBox.hintText
    print "textEditBox maxTextLength:" textEditBox.maxTextLength
    print "textEditBox cursorPosition:" textEditBox.cursorPosition
    print "textEditBox clearOnDownKey:" textEditBox.clearOnDownKey
    print "textEditBox active:" textEditBox.active
    print "textEditBox textColor:" textEditBox.textColor
    print "textEditBox hintTextColor:" textEditBox.hintTextColor
    print "textEditBox width:" textEditBox.width
    print "textEditBox backgroundUri:" textEditBox.backgroundUri
end sub

