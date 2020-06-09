' Tests to make sure that we can add fields
sub Main()
    node = createObject("roSGNode", "Node")
    node.addField("myAssocArray", "assocarray", false)

    node.myAssocArray = {
        foo: "bar"
    }
    print node.myAssocArray.foo ' => "bar"

    node.addField("myNode", "node", false)
    print node.myNode ' => invalid

    node.myNode = createObject("roSGNode", "Node")
    print node.myNode.subtype() ' => "Node"
end sub
