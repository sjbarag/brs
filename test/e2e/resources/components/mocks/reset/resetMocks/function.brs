sub Main()
    mockFunctionsHelper()
    print fooBar() ' => "fake fooBar"

    _brs_.resetMocks()
    print fooBar() ' => "foo bar"
end sub
