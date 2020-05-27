sub Main()
    node = createObject("roSGNode", "FieldChangeComponent")
    print "node text field before"
    print node.textField
    node.textField = "modified"
end sub
