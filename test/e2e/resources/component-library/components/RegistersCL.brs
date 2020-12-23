sub init()
    print "[RegistersCL::init]"
    print someUtil()

    print "[RegistersCL::init] createObject-ing Foo:Bar…"
    bar = createObject("roSGNode", "Foo:Bar")
    print "[RegistersCL::init] …done."
end sub
