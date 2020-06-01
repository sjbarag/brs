sub init()
end sub

function componentFunction(args as object) as object
    print "component: inside componentFunction, args.test: " args.test

    return { "success": true }
end function
