sub main()
    _brs_.global.addField("brsIntField", "int", false)
    _brs_.global.brsIntField = 123

    ' create an object that writes value to global, create another object that tries to read that value from global
    myComponent = createObject("roSGNode", "MGlobalWidget")
    mySecondComponent = createObject("roSGNode", "MUniversalWidget")
    print "MGlobalWidget.text: " myComponent.text 'prints an empty string
    print "MUniversalWidget.text: " mySecondComponent.text

    print "_brs_.global.value: " _brs_.global.value
end sub
