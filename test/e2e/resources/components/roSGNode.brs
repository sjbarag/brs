sub main()
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
    print "can check for existence: " node1.doesExist("bar")       ' => true

    node1.clear()
    print "can empty itself: " node1.count() = 0                   ' => true

    node1.addField("field1", "string", false)
    node1.addFields({ field2: 0, field3: false})

    print "node size: " node1.count()                              ' => 3
    
    node1.removeField("field2")
    print "node size: " node1.count()                              ' => 2

    print "field3 in node is: " node1.getField("field3")           ' => false

    node1.setField("field3", true)
    print "field3 in node now is: " node1.getField("field3")      ' => true

    node1.setFields({ field1: "hello", field3: false })
    print "field1 in node now is: " node1.getField("field1")      ' => hello
    print "field3 in node now is: " node1.getField("field3")      ' => false
end sub
