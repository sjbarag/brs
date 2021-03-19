sub main()
    ' mock formatJSON
    _brs_.mockfunction("formatJson", (function(json as object, flags=0 as integer) as dynamic
        return "{fake:'json'}"
    end function))

    ' call the mocked function
    print formatJson({}) ' => {fake:'json'}

    ' mock a function from this file
    _brs_.mockFunction("mocKMe", function()
        return "your wish is my command"
    end function)

    print mockMe() ' => "your wish is my command"

    ' Local vs function scope
    print foo() ' => Named foo

    foo = function()
        return "--inline foo--"
    end function

    print foo() ' => "--inline foo--"

    _brs_.mockFunction("foo", function()
        return "mOcKeD fOo"
    end function)

    print foo() ' => "--inline foo--"

    _brs_.mockFunction("thisFuncDoesNotExist", (function()
        return "doesn't exist in source yet here i am"
    end function))

    ' Will trigger a console.error warning that it doesn't exist in source.
    print thisFuncDoesNotExist() ' => "doesn't exist in source yet here i am"

    mock = _brs_.mockFunction("spyOnMe", function(arg1 as string, arg2 as integer) as string
        return "mocked implementation!"
    end function)

    print mock.getMockName() ' => "spyOnMe"

    spyOnMe("first string", 123)
    print mock.calls.count() ' => 1
    print mock.calls[0].count() ' => 2
    print mock.calls[0][0] ' => "first string"
    print mock.calls[0][1] ' => 123
    print mock.results.count() ' => 1
    print mock.results[0] ' => "mocked implementation!"

    spyOnMe("second string", 456)
    print mock.calls.count() ' => 2
    print mock.calls[1].count() ' => 2
    print mock.calls[1][0] ' => "second string"
    print mock.calls[1][1] ' => 456
    print mock.results.count() ' => 2
    print mock.results[1] ' => "mocked implementation!"

    mock.clearMock()
    print mock.calls.count() ' => 0
    print mock.results.count() ' => 0

    mock.mockReturnValue("foo")
    spyOnMe(1234)
    print mock.calls[0][0] ' => 1234
    print mock.results[0] ' => "foo"

    ' Should be able to call with any number of args
    spyOnMe()
    print mock.calls[1].count() ' => 0
    print mock.results[1] ' => "foo"

    ' Implicit mock
    mock = _brs_.mockFunction("originalHasArgs")
    ' should work with no args
    print originalHasArgs() ' => invalid

    ' should work with args that don't match the original signature
    print originalHasArgs(1, 2, 3, 4, 5) ' => invalid

    mock.mockReturnValue("mocked!")
    print originalHasArgs(1, 2, 3, 4, 5) ' => mocked!
end sub

function mockMe()
    return "oops!"
end function

function foo()
    return "Named foo"
end function

function spyOnMe(arg1 as string, arg2 as integer)
    return "original return value!"
end function

function originalHasArgs(arg1 as integer, arg2 as string, arg3 as object)
    return "abcd"
end function
