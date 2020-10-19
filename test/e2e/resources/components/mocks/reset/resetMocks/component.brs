sub Main()
    mockComponentsHelper()
    node = createObject("RoSGNode", "ResetMocks_Testbed")

    print node.foo ' => "fake testbed 1"

    _brs_.resetMocks()
    node = createObject("RoSGNode", "ResetMocks_Testbed")

    print node.foo ' => "bar"
end sub
