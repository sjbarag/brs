sub init()
    print formatJSON({}) ' => {real: 'json'}
    print http_get() ' => GET status: 200
    print http_post() ' => POST status: 200
    print isValid() ' => false
end sub
