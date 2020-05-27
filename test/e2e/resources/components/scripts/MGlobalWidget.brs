sub init()
    if not m.global.hasField("value") and not m.global.hasField("label") then
        m.global.addField("value", "string", false)
        m.global.value = "Globally setting this value"
        m.global.addField("label", "string", false)
        m.global.label = "Global Label"
   else
        m.top.text = m.global.value
        m.top.textLabel = m.global.label
    end if
end sub
