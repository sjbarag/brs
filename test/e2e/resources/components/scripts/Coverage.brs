sub main()
    ' node = createObject("roSGNode", "FieldChangeComponent")
    ' ' node.intField = 1234
    ' node.update({
    '     intField: 1234
    ' })

    ' return

    m.abc = {
        def: sub()
            print "here"
        end sub
    }
    m.abc.def()

    foo =true
    if foo then
        print "hello"
    else if false then
        print "world"
    else
        print "nice"
    end if
end sub
