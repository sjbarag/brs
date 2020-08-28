sub init()
    node = createObject("roSGNode", "FieldChangeComponent")
    print "runner: node childHandled text field value before modifying:" node.childHandledTextField
    node.childHandledTextField = "childHandled modified"
    print "runner: node childHandled text field value after modifying:" node.childHandledTextField

    print "runner: node parentHandled text field value before modifying:" node.parentHandledTextField
    node.parentHandledTextField = "parentHandled modified"
    print "runner: node parentHandled text field value after modifying:" node.parentHandledTextField

    node.id = "id-field-change"
    print "runner: modifying intField"
    node.intField = 123

    node.multipleTimesField = 123
    node.multipleTimesField = 456
end sub
