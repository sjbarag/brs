sub init()
end sub

sub onChildHandledFieldChange()
    print "child: text field changed. new value:" m.top.childHandledTextField
end sub

sub onFieldChangeWithEvent(event as object)
    print "child: event"
    print event

    print "child: event.getData()"
    print event.getData() ' => 123

    print "child: event.getField()"
    print event.getField() ' => "intField"

    print "child: event.getRoSGNode().subtype()"
    print event.getRoSGNode().subtype() ' => "FieldChangeComponent"

    print "child: event.getNode()"
    print event.getNode() ' => "id-field-change"
end sub
