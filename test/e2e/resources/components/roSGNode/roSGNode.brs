sub init()
    ' tests for ifAssociativeArray
    node1 = createObject("roSGNode", "Node")
    node1.foo = "foo"

    node1.addReplace("bar", 5)
    node1.append({ baz: false })

    print "node size: " node1.count()                              ' => 7
    print "node keys size: " node1.keys().count()                  ' => 7
    print "node items size: " node1.items().count()                ' => 7
    print "can delete elements: " node1.delete("baz")              ' => true
    print "can look up elements: " node1.lookup("foo") = "foo"     ' => true
    print "can look up elements (brackets): " node1["foo"] = "foo" ' => true
    print "can case insensitive look up elements: " node1.lookupCI("foO") = "foo" ' => true
    print "can check for existence: " node1.doesExist("bar")       ' => true

    node1.clear()
    print "can empty itself: " node1.count() = 0                   ' => true

    'ifNodeField tests
    node1.addField("field1", "string", false)
    node1.addFields({ field2: 0, field3: false})

    print "node size: " node1.count()                              ' => 3

    node1.removeField("field2")
    print "node size: " node1.count()                              ' => 2

    print "field3 in node is: " node1.getField("field3")           ' => false

    node1.setField("field3", true)
    print "field3 in node now is: " node1.getField("field3")      ' => true

    print "number of fields, via getFields().count(): " node1.getFields().count() ' => 2

    node1.setFields({ field1: "hello", field3: false })
    print "field1 in node now is: " node1.getField("field1")      ' => hello
    print "field3 in node now is: " node1.getField("field3")      ' => false

    print "field3 present? " node1.hasField("field3")
    print "fieldほ present? " node1.hasField("fieldほ")

    node1.observeField("field1", "onCB1Called")
    node1.observeField("field1", "onCB2Called")
    node1.observeField("field2", "onField2Cb") ' This doesn't get called since field was removed
    node1.observeField("field3", "onField3Cb")
    node1.setField("field1", "world")
    node1.update({ field2: 10, field3: true})

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
    childNode4 = createObject("roSGNode", "Node")
    childNode4.id = "new node"
    parentNode.replaceChild(childNode4, 0)
    print "first child id after replacing: " parentNode.getChild(0).id ' => new node
    print "parent child count: " parentNode.getChildCount()     ' => 2
    parentNode.removeChildren([childNode, childNode2])
    print "parent child count: " parentNode.getChildCount()         ' => 2
    parentNode.removeChildren([childNode3, childNode4])
    print "parent child count: " parentNode.getChildCount()         ' => 0
    parentNode.appendChild(childNode)
    parentNode.appendChild(childNode2)
    parentNode.appendChild(childNode3)
    parentNode.removeChildrenIndex(2, 7)
    print "parent child count: " parentNode.getChildCount()         ' => 3
    parentNode.removeChildrenIndex(3, 0)
    print "parent child count: " parentNode.getChildCount()         ' => 0
    parentNode.appendChildren([childNode, childNode2])
    print "parent child count: " parentNode.getChildCount()         ' => 2
    parentNode.appendChildren([childNode, childNode3])
    print "parent child count: " parentNode.getChildCount()         ' => 3
    parentNode.insertChild(childNode4, 0)
    print "parent child count: " parentNode.getChildCount()         ' => 4
    parentNode.insertChild(childNode3, 0)
    print "parent child count: " parentNode.getChildCount()         ' => 4
    parentNode.createChildren(2, "Node")
    print "parent child count: " parentNode.getChildCount()         ' => 6
    parentNode.removeChildren([childNode, childNode2])
    parentNode.replaceChildren([childNode, childNode2], 1)
    print "parent child count: " parentNode.getChildCount()         ' => 4
    parentNode.removeChildren([childNode3, childNode4])
    parentNode.insertChildren([childNode3, childNode4], 0)
    print "inserted child id: " parentNode.getChild(1).id         ' => new node
    parentNode.removeChildIndex(0)
    print "parent child count: " parentNode.getChildCount()         ' => 4
    childNode3.reparent(childNode4, false)
    print "new parent id: " childNode3.getParent().id         ' => new node
    print "new child count after reparent: " childNode4.getChildCount()    ' => 1
    'ifNodeDict tests
    ' no node exists
    currentNode = createObject("roSGNode", "Node")
    currentNode.id = "current"
    print "find node that does not exist: " currentNode.findNode("invalid-node-name") ' => invalid

    ' finds itself
    searchResult = currentNode.findNode("current")
    print "node finds itself: " searchResult.id                     ' => current

    ' finds one of its children
    child = currentNode.createChild("Node")
    child.id = "findnode-child"
    child.name = "Child"
    result = currentNode.findNode("findnode-child")
    print "node finds one of its children: " result.name            ' => Child

    ' finds a child of one of its children
    grandChild = child.createChild("Node")
    grandChild.id = "findnode-grandchild"
    grandChild.name = "Grandchild"
    grandChild2 = child.createChild("Node")
    grandChild2.id = "findnode-grandchild-2"
    grandChild2.name = "GrandChild-2"
    result = currentNode.findNode("findnode-grandchild")
    print "node finds its grandchild: " grandChild.name             ' => Grandchild

    ' finds a sibling node
    root = createObject("roSGNode", "Node")
    root.id = "root"
    root.name = "root-node"
    childrenIds = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"]
    children = {}
    for each id in childrenIds
        child = root.createChild("Node")
        child.id = id
        child.name = "sibling-" + id
        children[id] = child
    end for
    root.createChild("Node") ' create node with empty id

    result = children["c4"].findNode("c7")
    print "node finds its sibling: " result.name                    ' => name-c7

    ' finds a cousin node
    cousin1 = children["c1"].createChild("Node")
    cousin1.id = "cousin1"
    cousin1.name = "Cousin-1"

    cousin2 = children["c2"].createChild("Node")
    cousin2.id = "cousin2"
    cousin2.name = "Cousin-2"

    result = cousin1.findNode("cousin2")
    print "node finds a cousin node: " result.name                  ' => Cousin-2

    ' finds its grandparent
    result = cousin2.findNode("root")
    print "node finds its grandparent: " result.name                ' => root-node

    ' returns invalid on empty string
    result = root.findNode("")
    print "returns invalid on empty:" result

    ' returns true if both nodes are the same
    n = createObject("roSGNode", "Node")
    c = n.createChild("Node")
    print "is same node returns true:" c.isSameNode(n.getChildren(-1, 0)[0])    ' => true

    ' returns false if two different nodes are used
    print "is same node returns false:" c.isSameNode(n)                ' => false

    ' returns the node subtype
    print "Node subtype is returned:" n.subtype()                       ' => Node

    ' calling update function without optional createFields parameter doesn't add new fields
    node = createObject("roSGNode", "Node")
    node.id = "originalId"
    node.update({
        id: "updatedId",
        newField: "newValue"
    })
    print node.id
    print node.newField

    ' calling update function with optional createFields parameter set to true adds new fields
    node = createObject("roSGNode", "Node")
    node.id = "originalId"
    node.update({
        id: "updatedId",
        newField: "newValue"
    }, true)
    print node.id
    print node.newField

    ' calling update function with optional createFields parameter set to false doesn't add new fields
    node = createObject("roSGNode", "Node")
    node.id = "originalId"
    node.update({
        id: "updatedId",
        newField: "newValue"
    }, false)
    print node.id
    print node.newField

    ' setting numbers of different types on fields
    node = createObject("roSGNode", "ContentNode")
    node.FrameRate = 33.3
    ?node.FrameRate
    node.ClipStart = 37
    ?node.ClipStart

    ' ifSGNodeBoundingRect
    rect = node.boundingRect()
    print rect.x          ' => 0
    print rect.y          ' => 0
    print rect.height  ' => 0
    print rect.width  ' => 0
end sub

sub onCB1Called()
    print "callback 1 called"
    return
end sub

sub onCB2Called()
    print "callback 2 called"
end sub

sub onField2Cb()
    print "field 2 updated"
end sub

sub onField3Cb()
    print "field 3 updated"
end sub
