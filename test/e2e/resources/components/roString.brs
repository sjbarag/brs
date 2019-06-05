sub main()
    ' direct creation
    r = createObject("RoString", "foo")

    ' autoboxing
    s = "bar"
    s.setString("f")
    s.appendString("oo", 10)

    ' comparisons
    print r = s ' => true

    t = "a/b/c"
    print t.len() ' => 5
    print t.split("/")[1] ' => b

    u = "🐶"
    print u.encodeUriComponent() ' => %F0%9F%90%B6
    print "%F0%9F%90%B6".decodeUriComponent() ' => 🐶
end sub