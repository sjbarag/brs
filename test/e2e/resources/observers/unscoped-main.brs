sub main()
    ' observeField can only be called from the context of a node,
    ' so these tests happen in `UnscopedObserversTestBed::init()`
    createObject("roSGNode", "UnscopedObserversTestBed")
end sub
