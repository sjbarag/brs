sub main()
    node = createObject("RoSGNode", "CallFuncTestbed")

    ' call a function that requires typed arguments with the wrong type
    node.callFunc("stronglyTyped", { a: "b" })
end sub
