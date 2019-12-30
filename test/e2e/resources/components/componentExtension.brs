sub Main()
    ' Tests createNodeByType is properly calling init methods on each child and respective component extensions
    node = createObject("roSGNode", "ExtendedComponent")
    ' Above will call all init methods in the following order:
    ' - Each children in the BaseComponent (because ExtendedComponent extends it)
    ' - BaseComponent own init method, this will also call start() in the context of ExtendedComponent
    ' - Each children in the ExtendedComponent
    ' - ExtendedComponent own init
end sub
