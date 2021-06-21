sub main()
    node = createObject("RoSGNode", "CallFuncTestbed")

    ' call a function that requires typed arguments with _no_ arguments
    node.callFunc("stronglyTyped")
end sub
