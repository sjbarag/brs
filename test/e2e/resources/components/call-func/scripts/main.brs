sub main()
    m.mainField = "mainField value"
    node = createObject("RoSGNode", "CallFuncTestbed")

    m.componentField = "componentField modified value"

    result = node.callFunc("returnValFuncOneArg", { test: 123 })
    print "main: component returnValFuncOneArg return value success:" result.success ' => true

    voidResult = node.callFunc("voidFuncNoArgs")
    print "main: component voidFuncNoArgs return value:" voidResult ' => invalid

    privateResult = node.callFunc("privateFunc")
    print "main: component privateFunc return value:" privateResult ' => invalid

    node.callFunc("voidFuncFiveArgs", 1, 2, 3, 4, 5)

    print node.callFunc("parentFunc")

    print node.callFunc("overridenParentFunc")

    node.callFunc("testObserve")

    _brs_.mockComponent("CallFuncTestbed", {
        voidFuncNoArgs: function() as string
            return "this is a mock"
        end function
    })
    node = createObject("RoSGNode", "CallFuncTestbed")
    result = node.callFunc("voidFuncNoArgs")
    print "main: mocked component voidFuncNoArgs return value:" result ' => "this is a mock"
end sub
