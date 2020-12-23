sub main()
    ' onKeyEvent without a focused node should not call anything
    _brs_.triggerKeyEvent("OK", true)

    ' Send arbitrary string
    this = createComponents()
    this.child.setFocus(true)
    _brs_.triggerKeyEvent("foo", true)

    ' All 3 component handlers are called
    this = createComponents()
    this.child.setFocus(true)
    _brs_.triggerKeyEvent("OK", true)

    ' Only child and parent handlers are called
    _brs_.mockComponentPartial("KeyEvents_Parent", {
        getReturnValue: function() : return true : end function
    })
    this = createComponents()
    this.child.setFocus(true)
    _brs_.triggerKeyEvent("OK", true)
    _brs_.resetMocks()

    ' Only child handler is called
    _brs_.mockComponentPartial("KeyEvents_Child", {
        getReturnValue: function() : return true : end function
    })
    this = createComponents()
    this.child.setFocus(true)
    _brs_.triggerKeyEvent("OK", true)
    _brs_.resetMocks()
end sub

function createComponents() as object
    grandparent = createObject("RoSGNode", "KeyEvents_Grandparent")
    parent = grandparent.findNode("parent")
    child = grandparent.findNode("child")

    return {
        grandparent: grandparent,
        parent: parent,
        child: child
    }
end function
