sub init()
    if not m.global.hasField("value") then
        print "inside component init, m.global.brsIntField: " m.global.brsIntField
        m.global.addField("value", "string", false)
        m.global.value = "Globally setting this value"
   else
        m.top.text = m.global.value
    end if
end sub
