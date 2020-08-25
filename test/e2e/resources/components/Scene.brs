sub main()
    sceneNode = createObject("roSGNode", "Scene")
    print "scene node type:" type(sceneNode) ' => Node
    print "scene node subtype:" sceneNode.subtype() ' => Scene
    print "scene node background uri:" sceneNode.backgrounduri
    print "scene node backs exit scene:" sceneNode.backExitsScene

    extendedSceneNode = createObject("roSGNode", "ExtendedScene")
    print "extended scene node type:" type(extendedSceneNode) ' => Node
    print "extended scene node subtype:" extendedSceneNode.subtype() ' => ExtendedScene
    print "extended scene node background uri:" extendedSceneNode.backgrounduri
    print "extended scene node backs exit scene:" extendedSceneNode.backExitsScene
end sub