sub init()
    if not m.global.hasField("value") and not m.global.hasField("label") then
        m.global.addField("value", "string", false)
        m.global.value = "Globally setting this value"
   else
        m.top.text = m.global.value
    end if
end sub
