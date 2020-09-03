sub init()
    m.subtype = m.top.subtype()
    print "[" m.subtype "::init]"
    m.target = invalid
end sub

sub onTargetChanged(event as object)
    target = event.getData()
    if m.target <> invalid and target <> invalid and m.target.isSameNode(target) then return
    if target <> invalid then
        m.target = target
        print "[" + m.subtype + "#" + m.top.id + " :: onTargetChanged] observing"
        target.observeFieldScoped("trigger", "onTriggerChanged")
    end if
end sub

sub onTriggerChanged(event as object)
    trigger = event.getData()
    print "[" + m.subtype + "#" + m.top.id + " :: onTriggerChanged] trigger = " + trigger

    if trigger = "unobserve-" + m.top.id then
        result = m.top.target.unobserveFieldScoped("trigger")
        print "[" + m.subtype + "#" + m.top.id + " :: onTriggerChanged] unobserveFieldScoped result = " + result.toStr()
    end if
end sub
