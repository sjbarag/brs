sub init()
    callback()
end sub

sub callback()
    foo = {
        bar: sub()
            print "bar!"
        end sub
    }

    foo.bar()
end sub
