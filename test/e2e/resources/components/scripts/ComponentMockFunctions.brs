sub init()
    ' executing real function implementations derived by imported modules
    print formatJSON({}) ' => {real: 'json'}
    print http_get() ' => GET status: 200
    print http_post() ' => POST status: 200
    print isValid() ' => false

    _brs_.mockComponentPartial({
        formatJson: function(json as object, flags=0 as integer) as dynamic
            return "{fake:'json'}"
        end function,
        http_get: function()
            return "GET status: 400"
        end function,
        http_post: function()
            return "POST status: 500"
        end function,
        isValid: function()
            return true
        end function
    })

    ' results produced after mock functions are defined
    print formatJSON({}) ' => {fake:'json'}
    print http_get() ' => GET status: 400
    print http_post() ' => POST status: 500
    print isValid() ' => true
end sub