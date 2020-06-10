sub Main()
    markupgrid = createObject("roSGNode", "MarkupGrid")
    print "markupgrid node type:" type(markupgrid)
    print "markupgrid node subtype:" markupgrid.subtype()
    print "markupgrid node numRows:" markupgrid.numRows
    print "markupgrid node sectionDividerMinWidth:" markupgrid.sectionDividerMinWidth

    parent = createObject("roSGNode", "ComponentsAsChildren")
    markupgridAsChild = parent.findNode("markupgrid")
    print "markupgridAsChild numColumns:" markupgridAsChild.numColumns
    print "markupgridAsChild fixedLayout:" markupgridAsChild.fixedLayout
end sub
