sub main()
    ' observeField can only be called from the context of a node,
    ' so these tests happen in `RoSGNodeTestbed::init()`
    createObject("roSGNode", "RoSGNodeTestbed")
end sub
