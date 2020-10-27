sub init()
    ' assume parent node will be attached to the rootscene node tree, otherwise
    ' node focus is meaningless and won't work as expected.

    m.top.id = "top"

    m.child1 = m.top.findNode("child1")
    m.child2 = m.top.findNode("child2")
    m.child3 = m.top.findNode("child3")
    m.child4 = m.top.findNode("child4")
    m.child5 = m.top.findNode("child5")
    m.child6 = m.top.findNode("child6")

    m.child1.observeField("focusedChild", "onFocusChild1")
    m.child2.observeField("focusedChild", "onFocusChild2")
    m.child3.observeField("focusedChild", "onFocusChild3")
    m.child4.observeField("focusedChild", "onFocusChild4")
    m.child5.observeField("focusedChild", "onFocusChild5")
    m.child6.observeField("focusedChild", "onFocusChild6")
    m.top.observeField("focusedChild", "onFocusTop")

    ' focus on a leaf node, then unset
    m.child3.setFocus(true)
    m.child3.setFocus(false)

    print "----"

    ' focus on a leaf node, then a sibling leaf node
    m.child3.setFocus(true)
    m.child4.setFocus(true)
    m.child4.setFocus(false)

    print "----"

    ' focus on a leaf node, then a leaf node in a different subtree
    m.child3.setFocus(true)
    m.child6.setFocus(true)
    m.child6.setFocus(false)

    print "----"

    ' focus on a parent node, then a leaf node in its tree
    m.child1.setFocus(true)
    m.child3.setFocus(true)
    m.child3.setFocus(false)

    print "----"

    ' focus on a parent node, then a leaf node in a separate subtree
    m.child1.setFocus(true)
    m.child6.setFocus(true)
    m.child6.setFocus(false)
end sub

function getMessage(node as object, event as object) as string
    print "*" + node.id + "* " + node.focusedChild.id.toStr() + " " + event.getData().id.toStr() + " " + node.isInFocusChain().toStr()
end function

sub onFocusTop(event as object)
    getMessage(m.top, event)
end sub

sub onFocusChild1(event as object)
    getMessage(m.child1, event)
end sub

sub onFocusChild2(event as object)
    getMessage(m.child2, event)
end sub

sub onFocusChild3(event as object)
    getMessage(m.child3, event)
end sub

sub onFocusChild4(event as object)
    getMessage(m.child4, event)
end sub

sub onFocusChild5(event as object)
    getMessage(m.child5, event)
end sub

sub onFocusChild6(event as object)
    getMessage(m.child6, event)
end sub
