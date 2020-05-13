sub Main()
    layoutGroup = createObject("roSGNode", "LayoutGroup")
    print "layoutGroup node type:" type(layoutGroup)                                       ' => Group
    print "layoutGroup node layoutDirection:" layoutGroup.layoutDirection
    print "layoutGroup node horizAlignment:" layoutGroup.horizAlignment

    parent = createObject("roSGNode", "ComponentsAsChildren")
    layoutGroupAsChild = parent.findNode("layoutGroup")
    print "layoutGroup as child layoutDirection:" layoutGroupAsChild.layoutDirection
    print "layoutGroup as child horizAlignment:" layoutGroupAsChild.horizAlignment
end sub
