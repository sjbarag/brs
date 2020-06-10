sub main()
    ' create an object that writes value to global, create another object that tries to read that value from global
    myComponent = createObject("roSGNode", "MGlobalWidget")
    mySecondComponent = createObject("roSGNode", "MUniversalWidget")
    print myComponent.text 'prints an empty string
    print mySecondComponent.text
end sub
