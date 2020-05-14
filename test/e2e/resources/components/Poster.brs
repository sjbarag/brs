sub Main()
    poster = createObject("roSGNode", "Poster")
    print "poster node type:" type(poster)                                       ' => Group
    print "poster node width:" poster.width
    print "poster node height:" poster.height

    parent = createObject("roSGNode", "ComponentsAsChildren")
    posterAsChild = parent.findNode("poster")
    print "poster as child audioGuideText:" posterAsChild.audioGuideText
    print "poster as child uri:" posterAsChild.uri
    print "poster as child bitmapWidth:" posterAsChild.bitmapWidth
end sub
