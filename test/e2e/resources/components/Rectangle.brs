sub Main()
    rect = createObject("roSGNode", "Rectangle")
    print "rectangle node type:" type(rect)
    print "rectangle node subtype:" rect.subtype()
    print "rectangle node width:" rect.width
    print "rectangle node height:" rect.height

    parent = createObject("roSGNode", "ComponentsAsChildren")
    rectAsChild = parent.findNode("rectangle")
    print "rectangle as child width:" rectAsChild.width
    print "rectangle as child height:" rectAsChild.height
end sub
