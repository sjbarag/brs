sub init()
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

    spy = _brs_.mockFunction("spyOnMe", function(arg1 as string, arg2 as integer) as string
        return "mocked implementation!"
    end function)

    print spy.getMockName() ' => "spyOnMe"

    spyOnMe("first string", 123)
    print spy.calls.count() ' => 1
    print spy.calls[0].count() ' => 2
    print spy.calls[0][0] ' => "first string"
    print spy.calls[0][1] ' => 123
    print spy.results.count() ' => 1
    print spy.results[0] ' => "mocked implementation!"

    spyOnMe("second string", 456)
    print spy.calls.count() ' => 2
    print spy.calls[1].count() ' => 2
    print spy.calls[1][0] ' => "second string"
    print spy.calls[1][1] ' => 456
    print spy.results.count() ' => 2
    print spy.results[1] ' => "mocked implementation!"
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
