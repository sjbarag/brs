sub Main()
    node = createObject("roSGNode", "FieldChangeComponent")
    print "runner: node childHandled text field value before modifying:" node.childHandledTextField
    node.childHandledTextField = "childHandled modified"
    print "runner: node childHandled text field value after modifying:" node.childHandledTextField

    print "runner: node parentHandled text field value before modifying:" node.parentHandledTextField
    node.parentHandledTextField = "parentHandled modified"
    print "runner: node parentHandled text field value after modifying:" node.parentHandledTextField
end sub
