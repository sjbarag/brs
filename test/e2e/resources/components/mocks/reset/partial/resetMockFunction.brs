sub Main()
    _brs_.mockComponentPartial("ResetMocks_Testbed", {
        funcTestbed: function()
            return "scoped fake funcTestbed"
        end function
    })
    _brs_.mockFunction("funcTestbed", function()
        return "unscoped fake funcTestbed"
    end function)
    node = createObject("RoSGNode", "ResetMocks_Testbed")
    node2 = createObject("RoSGNode", "ResetMocks_Testbed_2")

    print funcTestbed()                 ' => "unscoped fake funcTestbed"
    print node.callFunc("funcTestbed")  ' => "scoped fake funcTestbed"
    print node2.callFunc("funcTestbed") ' => "unscoped fake funcTestbed"

    _brs_.resetMockFunction("funcTestbed")
    node = createObject("RoSGNode", "ResetMocks_Testbed")
    node2 = createObject("RoSGNode", "ResetMocks_Testbed_2")

    print funcTestbed()                 ' => "real funcTestbed"
    print node.callFunc("funcTestbed")  ' => "scoped fake funcTestbed"
    print node2.callFunc("funcTestbed") ' => "invalid"
end sub
