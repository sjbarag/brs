sub main()
    print formatJson({}) ' => {real: 'json'}
    print get() ' => Status: 500
    print post() ' => Status: 200
    print isValid() ' => false

    _brs_.mockComponentPartial({
        formatJson: _brs_.mockFunction("formatJson", function(json as object, flags=0 as integer) as dynamic
                 return "{fake:'json'}"
            end function)
        get: _brs_.mockFunction("get", function()
                return "Status: 200"
            end function),
        post: _brs_.mockFunction("post", function()
            return "Status: 500"
        end function)
        isValid: _brs_.mockFunction("isValid",function()
            return true
        end function)
    })

    print formatJson({}) ' => {fake: 'json'}
    print get() ' => Status: 200
    print post() ' => Status: 500
    print isValid() ' => true
end sub

function formatJson(json as object, flags=0 as integer)
    return "{real: 'json'}"
end function

function get()
    return "Status: 500"
end function

function post()
    return "Status: 200"
end function

function isValid()
    return false
end function