sub Main()
    font = createObject("roSGNode", "Font")
    print "font node type:" type(font)
    print "font node subtype:" font.subtype()
    print "font node uri:" font.uri
    print "font node size:" font.size
    print "font node fallbackGlyph:" font.fallbackGlyph

    parent = createObject("roSGNode", "ComponentsAsChildren")
    fontAsChild = parent.findNode("font")
    print "font as child size:" fontAsChild.size
    print "font as child uri:" fontAsChild.uri
end sub
