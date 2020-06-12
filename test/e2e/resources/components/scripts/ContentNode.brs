sub Main()
    contentnode = createObject("roSGNode", "ContentNode")
    print "contentnode node type:" type(contentnode)
    print "contentnode node subtype:" contentnode.subtype()

    ' These are initially unset + hidden, but still accessible, so printing them out verifies that
    ' we don't throw an access error.
    print "contentnode.ContentType:" contentnode.ContentType
    print "contentnode.TargetRotation:" contentnode.TargetRotation

    parent = createObject("roSGNode", "ComponentsAsChildren")
    contentnodeAsChild = parent.findNode("contentnode")
    print "contentnodeAsChild.episodeNumber:" contentnodeAsChild.episodeNumber
    print "contentnodeAsChild.subtitleUrl:" contentnodeAsChild.subtitleUrl
end sub
