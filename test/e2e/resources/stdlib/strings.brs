mixedCase = "Mixed Case"

print UCase(mixedCase)
print LCase(mixedCase)

print Asc("ぇ")
print Chr(12359) ' UTF-16 decimal for "ぇ"

print Left(mixedCase, 5)
print Right(mixedCase, 4) ' "Case"
print Len(mixedCase) ' 10
print Mid(mixedCase, 4, 2) ' "ed"
print Instr(0, mixedCase, "Case") ' 7
print Instr(6, mixedCase, "e") ' 10
