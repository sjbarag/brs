sub Main()
    ' Tests createNodeByType is properly parsing xml files, creating fields, and setting field values
    node = createObject("roSGNode", "AdvancedWidget")
    print "node.baseBoolField: "
    print node.baseBoolField
    print "node.baseIntField: "
    print node.baseIntField
    print "node.normalBoolField: "
    print node.normalBoolField
    print "node.advancedStringField: "
    print node.advancedStringField
    print "node.advancedIntField: "
    print node.advancedIntField
    print "node child count is: " node.getChildCount() ' => 6
    ' Look for child in parent component
    normalLabel = node.findNode("normalLabel")
    print "child id is: " normalLabel.id ' => normalLabel

    otherNode = createObject("roSGNode", "NormalWidget")
    print otherNode
    print "otherNode child count is: " otherNode.getChildCount() ' => 3

    anotherNode = createObject("roSGNode", "BaseWidget")
    print "anotherNode child count is: " anotherNode.getChildCount() ' => 1
    baseRectangle = anotherNode.findNode("baseRectangle")
    print "baseRectangle width: " baseRectangle.width
    print "baseRectangle height: " baseRectangle.height
end sub
