sub Main()
    m.mainField = "mainField value"
    node = createObject("RoSGNode", "CallFuncComponent")

    m.componentField = "componentField modified value"

    result = node.callFunc("componentFunction", { test: 123 })
    print "main: componentFunction return value success:" result.success ' => true

    voidResult = node.callFunc("componentVoidFunction")
    print "main: componentVoidFunction return value:" voidResult ' => invalid

    privateResult = node.callFunc("componentPrivateFunction")
    print "main: componentPrivateFunction return value:" privateResult ' => invalid
end sub
