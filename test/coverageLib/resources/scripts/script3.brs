sub init()
    foo = true
    bar = false
    if foo then
        found = "foo"
    else if bar then
        found = "bar"
    else
        found = "unknown"
    end if

    foo = false
    bar = true
    if foo then
        found = "foo"
    else if bar then
        found = "bar"
    else
        found = "unknown"
    end if

    foo = false
    bar = false
    if foo then
        found = "foo"
    else if bar then
        found = "bar"
    else
        found = "unknown"
    end if
end sub
