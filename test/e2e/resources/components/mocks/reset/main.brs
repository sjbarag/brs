sub Main()
    ' mock to start
    mockFunctionsHelper()
    print fooBar() ' => "fake fooBar"

    _brs_.resetMocks()
    print fooBar() ' => "foo bar"

    ' create mocks
    mockComponentsHelper()

    node = createObject("RoSGNode", "ResetMocks_Testbed")
    print node.foo ' => "fake testbed 1"

    _brs_.resetMocks()

    node = createObject("RoSGNode", "ResetMocks_Testbed")
    print node.foo ' => "bar"

    mockFunctionsHelper()
    mockComponentsHelper()
    node = createObject("RoSGNode", "ResetMocks_Testbed")

    _brs_.resetMockFunctions()

    print fooBar() ' => "foo bar"
    print node.foo ' => "fake testbed 1"

    mockFunctionsHelper()
    mockComponentsHelper()

    _brs_.resetMockComponents()
    node = createObject("RoSGNode", "ResetMocks_Testbed")

    print fooBar() ' => "fake fooBar"
    print node.foo ' => "bar"

    _brs_.resetMocks()

    mockFunctionsHelper()
    mockComponentsHelper()

    _brs_.resetMockComponent("ResetMocks_Testbed_2")
    node = createObject("RoSGNode", "ResetMocks_Testbed")
    node2 = createObject("RoSGNode", "ResetMocks_Testbed_2")

    print node.foo  ' => "fake testbed 1"
    print node2.foo ' => "bar"

    _brs_.resetMockFunction("fooBar")
    print fooBar()  ' => "foo bar"
    print barBaz()  ' => "fake barBaz"
end sub

function fooBar()
    return "foo bar"
end function

function barBaz()
    return "bar baz"
end function

function mockFunctionsHelper()
    _brs_.mockFunction("fooBar", function() as string
        return "fake fooBar"
    end function)

    _brs_.mockFunction("barBaz", function() as string
        return "fake barBaz"
    end function)
end function

function mockComponentsHelper()
    _brs_.mockComponent("ResetMocks_Testbed", {
        foo: "fake testbed 1"
    })
    _brs_.mockComponent("ResetMocks_Testbed_2", {
        foo: "fake testbed 2"
    })
end function
