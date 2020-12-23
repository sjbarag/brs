function printStackTrace()
    stack = _brs_.getStackTrace()
    stackTraceHelper(stack)
    stack = _brs_.getStackTrace(1)
    stackTraceHelper(stack)
    stack = _brs_.getStackTrace(10, ["@external"])
    stackTraceHelper(stack)
    stack = _brs_.getStackTrace(10, ["print.brs", "@external"])
    stackTraceHelper(stack)
end function

' Helper function for cleaner output in test case.
function stackTraceHelper(stack)
    print "--- stack ---"
    for each line in stack
        print line
    end for
end function
