sub main()
    ' create an object that uses m.top
    myComponent = createObject("roSGNode", "MTopWidget")

    print myComponent.stringField ' => "this value set using m.top"

    ' m.top in this script should not refer to anything
    print m.top ' => invalid
end sub
