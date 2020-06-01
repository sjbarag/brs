sub Main()
    node = createObject("RoSGNode", "CallFuncComponent")
    result = node.callFunc("componentFunction", { test: 123 })
    print "main: componentFunction return value success:" result.success
end sub
