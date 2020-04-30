sub init()
    m.top.stringField = "this value set using m.top"

    print getDefaultTopValue()
end sub

function getDefaultTopValue() as string
    return m.top.defaultValueField
end function
