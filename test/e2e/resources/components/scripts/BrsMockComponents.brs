sub init()
    ' testing mock objects with functions
    _brs_.mockComponent("roTimespan", {
        mark: (sub()
            print "marking mock timespan"
        end sub),
        totalMilliseconds: (function()
            return 8
        end function),
        name: "timespan"
    })
    mockTimespan = createObject("roTimespan")
    mockTimespan.mark()
    print "mocked timespan should return 8: " mockTimespan.totalMilliseconds()  ' => 8

    ' testing the type of mocked objects
    realRegex = createObject("roRegex", "[a-z]+", "i")
    print "create object regex:" type(realRegex)                                ' => roRegex

    _brs_.mockComponent("roRegex", {})
    mockRegex = createObject("roRegex", "a-z+", "i")
    print "mock object regex:" type(mockRegex)                                  ' => roSGNode

    ' testing observe field of mock object
    mockTimespan.observeField("name", "onNameChanged")
    mockTimespan.name = "updated name"

    ' testing createObject("roSGNode", SOME_TYPE)
    _brs_.mockComponent("poster", {
        name: "poster"
    })
    mockPoster = createObject("roSGNode", "Poster")
    print "mock poster name:" mockPoster.name

    ' testing mock objects with fields, functions and parameters
    _brs_.mockComponent("fakeType", {
        getChild: (function(index as integer)
            return { index: index }
        end function),
        id: "id",
        name: "name"
    })
    mockNode = createObject("roSGNode", "fakeType")
    secondMockNode = createObject("roSGNode", "fakeType")
    mockNode.id = "node-id"
    mockNode.name = "node-name"
    mockChild = mockNode.getChild(333)

    print "mocked node id:" mockNode.id                     ' => node-id
    print "mocked node name:" mockNode.name                 ' => node-name
    print "mocked node child index:" mockChild.index        ' => 333

    print "second mock node id is not mutated by first mock:" secondMockNode.id     ' => id
    print "second mock node name is not mutated by first mock:" secondMockNode.name ' => name

    ' mock a child of NormalWidget (Label) and ensure the mock is created when the parent is
    _brs_.mockComponent("Label", {
        id: "normalLabel",
        extra_field: true
    })
    widget = createObject("roSGNode", "NormalWidget")
    label = widget.findNode("normalLabel")
    print "created mock for child node:" label.hasField("extra_field") ' => true
end sub

sub onNameChanged()
    print "in name change callback"
end sub
