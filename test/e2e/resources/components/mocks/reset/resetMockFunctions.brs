sub Main()
    mockFunctionsHelper()
    mockComponentsHelper()

    node = createObject("RoSGNode", "ResetMocks_Testbed")
    _brs_.resetMockFunctions()

    print fooBar() ' => "foo bar"
    print node.foo ' => "fake testbed 1"
end sub
