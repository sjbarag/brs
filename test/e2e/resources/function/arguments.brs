' ----- declare a bunch of functions -----
function noArgsFunc()
    print "noArgsFunc"
end function

function requiredArgsFunc(a, b)
    print "requiredArgsFunc:"
    print a
    print b
end function

function typedArgsFunc(a as float, b as integer, c as boolean)
    print "typedArgsFunc:"
    print a
    print b
    print c
end function

function optionalArgsFunc(a as integer, b = 2, c = a * 2)
    print "optionalArgsFunc:"
    print a
    print b
    print c
end function

' ----- then execute them -----
noArgsFunc()
requiredArgsFunc(1, 2)
typedArgsFunc(2.5, 3, false)
optionalArgsFunc(-5)