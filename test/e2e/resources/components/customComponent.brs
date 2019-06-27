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
end sub
