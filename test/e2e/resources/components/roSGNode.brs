sub main()
    node1 = createObject("roSGNode", "Node")
    print(node1)

    ' is case sensitive (node type doesn't exist)
    node2 = createObject("roSGNode", "node")
    print(node2)
end sub
