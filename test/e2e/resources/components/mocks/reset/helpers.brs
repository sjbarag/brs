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

function funcTestbed()
    return "real funcTestbed"
end function
