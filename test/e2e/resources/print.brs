' All examples inspired by Roku documentation:
' https://sdkdocs.roku.com/display/sdkdoc/Program+Statements#ProgramStatements-PRINTitemlist

' no separators
print "lorem " 1 "psum"

' arbitrary mixes of separators
print 9; " is equal to"; 3^2
print "column a", "column b", "column c", "column d"

' arbitrary tabbing
print tab(3) "I started at col 3"; tab(25) "I started at col 25"

' print position
print "0123" pos(0)

' calculate tabs based on position, though you'd probably want to just define "    " as a variable
print "lorem" tab(pos(0) + 4) "ipsum" tab(pos(0) + 4) "dolor" tab(pos(0) + 4) "sit" tab(pos(0) + 4) "amet"

' suppress trailing newline
print "no newline";