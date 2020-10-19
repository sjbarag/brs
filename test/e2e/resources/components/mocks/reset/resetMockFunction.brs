sub Main()
    mockFunctionsHelper()
    _brs_.resetMockFunction("fooBar")

    print fooBar()  ' => "foo bar"
    print barBaz()  ' => "fake barBaz"
end sub
