sub Main()
    mockComponentsHelper()
    _brs_.resetMockComponent("ResetMocks_Testbed_2")

    node = createObject("RoSGNode", "ResetMocks_Testbed")
    node2 = createObject("RoSGNode", "ResetMocks_Testbed_2")

    print node.foo  ' => "fake testbed 1"
    print node2.foo ' => "bar"
end sub
