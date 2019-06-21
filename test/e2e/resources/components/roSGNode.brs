sub main()
    ' tests for ifAssociativeArray
    node1 = createObject("roSGNode", "Node")
    node1.foo = "foo"

    node1.addReplace("bar", 5)
    node1.append({ baz: false })

    print "node size: " node1.count()                              ' => 3
    print "node keys size: " node1.keys().count()                  ' => 3
    print "node items size: " node1.items().count()                ' => 3
    print "can delete elements: " node1.delete("baz")              ' => true
    print "can look up elements: " node1.lookup("foo") = "foo"     ' => true
    print "can look up elements (brackets): " node1["foo"] = "foo" ' => true
    print "can check for existence: " node1.doesExist("bar")       ' => true

    node1.clear()
    print "can empty itself: " node1.count() = 0                   ' => true

    'ifNodeChildren tests
    parentNode = createObject("roSGNode", "Node")
    parentNode.id = "parent"
    print "parent child count: " parentNode.getChildCount()        ' => 0
    childNode = parentNode.createChild("Node")
    testParent = childNode.getParent()
    print "get same parent from child: " parentNode.id = testParent.id '=> true
    print "parent child count: " parentNode.getChildCount()        ' => 1
    childNode2 = createObject("roSGNode", "Node")
    parentNode.appendChild(childNode2)
    print "parent child count: " parentNode.getChildCount()        ' => 2
    childNode3 = parentNode.createChild("Node")
    print "parent child count: " parentNode.getChildCount()        ' => 3
    parentNode.removeChild(childNode)
    print "parent child count: " parentNode.getChildCount()        ' => 2
    children = parentNode.getChildren(-1, 0)
    print "children size: " children.count()                       ' => 2

    ' ifSGNodeFocus tests
    ' assume parent node will be attached to the rootscene node tree, otherwise
    ' node focus is meaningless and won't work as expected.
    parentNode = createObject("roSGNode", "Node")
    childNode1 = parentNode.createChild("Node")
    childNode2 = parentNode.createChild("Node")
    grandChild1 = childNode1.createChild("Node")
    grandChild2 = childNode2.createChild("Node")
    print "is parent in focus chain: " parentNode.isInFocusChain()     ' => false
    grandChild1.setFocus(true)
    print "is parent in focus chain: " parentNode.isInFocusChain()     ' => true
    print "does grand child1 have focus: " grandChild1.hasFocus()  ' => true
    childNode2.setFocus(true)
    print "does grand child1 still have focus: " grandChild1.hasFocus() ' => false
    print "does child2 have focus: " childNode2.hasFocus()  ' => true
end sub
