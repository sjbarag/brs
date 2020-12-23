sub main()
    ' observeField can only be called from the context of a node,
    ' so these tests happen in `FieldChangeTestbed::init()`
    createObject("roSGNode", "FieldChangeTestbed")
end sub
