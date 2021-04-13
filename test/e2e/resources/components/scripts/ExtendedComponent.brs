sub init()
    print "ExtendedComponent init"
    start()
    caseinsensitivefunction()

    print m.top.isSubtype("ExtendedComponent")
    print m.top.isSubtype("BaseComponent")
    print m.top.isSubtype("Node")
    print m.top.isSubtype("OtherComponent")
    print m.top.parentSubtype("ExtendedComponent")
    print m.top.parentSubtype("BaseComponent")
end sub
