sub Main()
    ' mock formatJSON
    _brs_.mockfunction("formatJson", (function(json as object, flags=0 as integer) as dynamic
        return "{fake:'json'}"
    end function))

    ' call the mocked function
    print formatJson({}) ' => {fake:'json'}
end sub
