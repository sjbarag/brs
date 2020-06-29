sub Main()
    timer = createObject("roSGNode", "Timer")
    print "timer node type:" type(timer)
    print "timer node subtype:" timer.subtype()
    print "timer node control:" timer.control
    print "timer node repeat:" timer.repeat
    print "timer node duration:" timer.duration
    print "timer node fire:" timer.fire
end sub
