sub init()
    m.componentField = "componentField value"
    m.emptyNode = createObject("roSGNode", "ContentNode")
    m.emptyNode.update({
        observeMe: false
    }, true)
end sub

function returnValFuncOneArg(args as object) as object
    print "component: inside oneArg, args.test: " args.test
    print "component: componentField:" m.componentField
    print "component: mainField:" m.mainField

    return { "success": true }
end function

function voidFuncFiveArgs(arg1, arg2, arg3, arg4, arg5)
    print "component: inside fiveArgs"
    print "arg1: " arg1
    print "arg2: " arg2
    print "arg3: " arg3
    print "arg4: " arg4
    print "arg5: " arg5
end function

sub voidFuncNoArgs()
    print "component: inside voidFunctionNoArgs"
end sub

function privateFunc() as string
    print "component: inside privateFunction"
    return "private return value"
end function

function overridenParentFunc() as string
    return "component: overriding parent func"
end function

sub testObserve()
    m.emptyNode.observeField("observeMe", "onObserveMeChanged")
    m.emptyNode.observeMe = true
end sub

sub onObserveMeChanged(event as object)
    print "callFunc can trigger observeField"
end sub
