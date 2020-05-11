sub Main()
    groupNode = createObject("roSGNode", "Group")
    print "group node type:" type(groupNode)                                       ' => Group
    print "group node visible:" groupNode.visible                                  ' => true
    print "group node opacity:" groupNode.opacity                                  ' => 1

    extendedGroupNode = createObject("roSGNode", "ExtendedGroup")
    print "extended group node type:" type(extendedGroupNode)                      ' => ExtendedGroup
    print "extended group node visible:" extendedGroupNode.visible                 ' => true
    print "extended group node opacity:" extendedGroupNode.opacity                 ' => 1

    parentOfGroup = createObject("roSGNode", "GroupAsChild")
    groupAsChild = parentOfGroup.findNode("childgroup")
    print "group as child node rotation:" groupAsChild.rotation
end sub
