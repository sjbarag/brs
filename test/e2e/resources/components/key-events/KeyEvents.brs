function onKeyEvent(key as string, press as boolean) as boolean
    print "onKeyEvent " + m.top.subtype()
    print key
    print press

    return getReturnValue()
end function

' create a separate function so we can mock it easily
function getReturnValue()
    return false
end function
