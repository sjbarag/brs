sub Main()
    ' mock to start
    mockFunctionsHelper()
    print fooBar() ' => "fake"

    _brs_.resetMocks()
    print fooBar() ' => "foo bar"

    ' create mocks
    mockComponentsHelper()

    node = createObject("RoSGNode", "ResetMocksComponent")
    print node.foo ' => "fake"

    _brs_.resetMocks()

    node = createObject("RoSGNode", "ResetMocksComponent")
    print node.foo ' => "bar"

    mockFunctionsHelper()
    mockComponentsHelper()
    node = createObject("RoSGNode", "ResetMocksComponent")

    _brs_.resetMockFunctions()

    print fooBar() ' => "foo bar"
    print node.foo ' => "fake"

    mockFunctionsHelper()
    mockComponentsHelper()

    _brs_.resetMockComponents()
    node = createObject("RoSGNode", "ResetMocksComponent")

    print fooBar() ' => "fake"
    print node.foo ' => "bar"
end sub

function fooBar()
    return "foo bar"
end function


function mockFunctionsHelper()
    _brs_.mockFunction("fooBar", function() as string
        return "fake"
    end function)
end function

function mockComponentsHelper()
    _brs_.mockComponent("ResetMocksComponent", {
        foo: "fake"
    })
end function
