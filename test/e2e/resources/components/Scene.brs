sub main()
    sceneNode = createObject("roSGNode", "Scene")
    print "scene node type:" type(sceneNode) ' => Node
    print "scene node subtype:" sceneNode.subtype() ' => Scene
    print "scene node backs exit scene:" sceneNode.backExitsScene ' => true

    sceneNode.backgroundUri = "/images/arrow.png"
    print "scene node background uri:" sceneNode.backgroundUri

    sceneNode.backgroundColor = "0xEB1010FF"
    print "scene node background color:" sceneNode.backgroundColor

    extendedSceneNode = createObject("roSGNode", "ExtendedScene")
    print "extended scene node type:" type(extendedSceneNode) ' => Node
    print "extended scene node subtype:" extendedSceneNode.subtype() ' => ExtendedScene
    print "extended scene node backs exit scene:" extendedSceneNode.backExitsScene ' => true

    extendedSceneNode.backgroundUri = "/images/arrow.png"
    print "extended scene node background uri:" extendedSceneNode.backgroundUri

    extendedSceneNode.backgroundColor = "0xEB1010FF"
    print "extended scene node background color:" extendedSceneNode.backgroundColor

end sub
