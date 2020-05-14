sub Main()
    label = createObject("roSGNode", "Label")
    print "label node type:" type(label)
    print "label node horizAlign:" label.horizAlign
    print "label node numLines:" label.numLines

    parent = createObject("roSGNode", "ComponentsAsChildren")
    labelAsChild = parent.findNode("label")
    print "label as child numLines:" labelAsChild.numLines
    print "label as child wrap:" labelAsChild.wrap
    print "label as child lineSpacing:" labelAsChild.lineSpacing
end sub
