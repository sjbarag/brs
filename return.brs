' ----- declare a bunch of functions -----
function staticReturn()
    return "staticReturn"
end function

function conditionalReturn(t as boolean)
    print "conditionalReturn:"
    if t = true then
        return 5
    else
        return invalid
    end if
end function

' ----- then execute them -----
'print staticReturn()
print conditionalReturn(true)
print conditionalReturn(false)
