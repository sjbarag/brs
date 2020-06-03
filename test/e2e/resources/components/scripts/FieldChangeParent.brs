sub init()
end sub

sub onChildHandledFieldChange()
    print "parent: childHandled text field changed"
    print m.top.childHandledTextField
end sub

sub onParentHandledFieldChange()
    print "parent: parentHandled text field changed"
    print m.top.parentHandledTextField
end sub
