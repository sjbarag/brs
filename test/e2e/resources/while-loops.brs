foo = 0

' count to five
while foo < 5
    print foo
    foo = foo + 1
end while

' count down to zero
while foo > 0
    print foo
    foo = foo - 1
    ' but stop at three
    if foo = 3 then exit while
end while