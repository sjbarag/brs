sub Main()
    arraygrid = createObject("roSGNode", "ArrayGrid")
    print "arraygrid node type:" type(arraygrid)
    print "arraygrid node subtype:" arraygrid.subtype()
    print "arraygrid node focusRow:" arraygrid.focusRow
    print "arraygrid node jumpToItem:" arraygrid.jumpToItem

    parent = createObject("roSGNode", "ComponentsAsChildren")
    arraygridAsChild = parent.findNode("arraygrid")
    print "arraygrid as child wrapDividerWidth" arraygridAsChild.wrapDividerWidth
    print "arraygrid as child numRows" arraygridAsChild.numRows
end sub
