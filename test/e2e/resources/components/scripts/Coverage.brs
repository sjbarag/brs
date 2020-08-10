sub main()
    node = createObject("roSGNode", "FieldChangeComponent")
    ' node.intField = 1234
    node.update({
        intField: 1234
    })
end sub
