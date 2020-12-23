function parentFunc() as string
    print "Inside parent function"
    return privateFunc() ' this will work as long as we're in the child context
end function

function overridenParentFunc() as string
    return "this should be overriden"
end function
