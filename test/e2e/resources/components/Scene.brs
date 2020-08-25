sub Main()
    sceneNode = createObject("roSGNode", "Scene")
    print sceneNode
    print "scene node type:" type(sceneNode) ' => Scene
    print "scene node subtype": sceneNode.subtype()
end sub