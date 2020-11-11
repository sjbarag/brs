sub main()
    _brs_.process.setLocale("en_US")
    print tr("Hello") ' => Bonjour
    print tr("hello") ' => hello
    print tr("Fare thee well") ' => Au revoir

    obj = parseJson(tr("Not a straightforward string"))
    print obj.hello[0] ' => "world"
    print obj.foo ' => 123
end sub
