sub Main()
    mockFunctionsHelper()
    mockComponentsHelper()

    _brs_.resetMockComponents()
    node = createObject("RoSGNode", "ResetMocks_Testbed")

    print fooBar() ' => "fake fooBar"
    print node.foo ' => "bar"
end sub
