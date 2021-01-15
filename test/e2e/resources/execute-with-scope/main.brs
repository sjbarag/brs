function main(arg)
    print "main:arg:" + arg
    print "main:" + commonUtil()
    print "main:" + onlyInScopeForMain()

    return "main return value"
end function

function onlyInScopeForMain()
    return "onlyInScopeForMain"
end function
