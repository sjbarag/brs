function foo()
    print "empty funciton"
end function

sub bar()
    print "empty sub"
end sub

function baz(a, b, c)
    d = 1
    e = 2
    f = a + b
end function

function lorem(a as string, b as integer, c as double, d as float)
    print a
    print b
    print c
    print d
    print e
end function

function ipsum(a as string, b = 5 as integer, c = b + 0.5 as double, d = c * 2 as float)
    print a
    print b
    print c
    print d
    print e
end function