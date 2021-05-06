sub main()
    _brs_.mockFunction("commonUtil", function()
        return "mocked"
    end function)

    print "mock:" + commonUtil() ' => "mocked"
end sub
