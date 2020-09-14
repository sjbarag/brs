' function
sub main()
    branches()              ' statement

    foo = [1, 2, 3]         ' statement
    foo[0] = 4              ' statement

    bar = {                 ' statement
        baz: sub()          ' function
            print "baz!"    ' statement
        end sub
    }
    bar.baz()               ' statement
end sub

' function
sub unusedFunc()
    print "i am unused"     ' statement
end sub

' function
sub branches()
    if true then            ' branch 1.1 => taken
        found = "foo"       ' statement
    else if false then      ' branch 1.2 => not taken
        found = "bar"       ' statement
    else                    ' branch 1.3 => not taken
        found = "baz"       ' statement
    end if

    if false then           ' branch 2.1 => taken
        found = "foo"       ' statement
    else if true then       ' branch 2.2 => taken
        found = "bar"       ' statement
    else                    ' branch 2.3 => not taken
        found = "baz"       ' statement
    end if

    if false then           ' branch 2.1 => taken
        found = "foo"       ' statement
    else                    ' branch 2.2 => taken
        found = "baz"       ' statement
    end if
end sub
