sub main()
    ' create an object that uses m.top

    ' MTopWidget will print three values:
    '   - a default field value defined in xml
    '   - whether or not m.top is invalid from a local object func call
    '   - whether or not m.top is invalid from the component itself
    myComponent = createObject("roSGNode", "MTopWidget")

    print myComponent.stringField ' => "this value set using m.top"

    ' m.top in this script should not refer to anything
    print m.top ' => invalid
end sub
