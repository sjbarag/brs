sub Main()
    node = createObject("roSGNode", "FieldChangeComponent")
    print "runner: node text field value before modifying:" node.textField
    node.textField = "modified"
    print "runner: node text field value after modifying:" node.textField
end sub
