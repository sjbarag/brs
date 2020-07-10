sub init()
    ' results produced after mock functions are defined
    print formatJSON({}) ' => {fake:'json'}
    print http_get() ' => GET status: 400
    print http_post() ' => POST status: 500
    print isValid() ' => true
end sub
