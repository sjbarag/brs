sub main()
    ' observeFieldScoped can only be called from the context of a node,
    ' so these tests happen in `ScopedObserversTestBed::init()`
    createObject("roSGNode", "ScopedObserversTestBed")
end sub
