sub init()
    print "ExtendedComponent init"
    start()

    print m.top.isSubtype("ExtendedComponent")
    print m.top.isSubtype("BaseComponent")
    print m.top.isSubtype("Node")
    print m.top.isSubtype("OtherComponent")
end sub
