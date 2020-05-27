sub main()
    ' create an object that uses m.global
    myComponent = createObject("roSGNode", "MGlobalWidget")
    mySecondComponent = createObject("roSGNode", "MGlobalWidget")
    print mySecondComponent.text
    print mySecondComponent.textLabel
end sub
