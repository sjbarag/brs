sub init()
    target = createObject("roSGNode", "Node")
    target.update({ trigger: "none" }, true)

    a = createObject("roSGNode", "UnscopedObserver")
    b = createObject("roSGNode", "UnscopedObserver")
    c = createObject("roSGNode", "UnscopedObserver2")

    a.id = "a"
    a.target = target

    b.id = "b"
    b.target = target

    c.id = "c"
    c.target = target

    target.trigger = "1"
    target.trigger = "2"
    target.trigger = "unobserve-a"
    target.trigger = "3"
end sub
