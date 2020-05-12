sub Main()
    rect = createObject("roSGNode", "Rectangle")
    print "rectangle node type:" type(rect)                                       ' => Group
    print "rectangle node width:" rect.width
    print "rectangle node height:" rect.height
end sub
