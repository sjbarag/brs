print formatJson(parseJson("{""boolean"":false,""float"":3.14,""integer"":2147483647,""longInteger"":2147483650,""null"":null,""string"":""ok""}"))
print parseJson(formatJson({
    string: "ok",
    null: invalid,
    longInteger: 2147483650,
    integer: 2147483647,
    float: 3.14,
    boolean: false
}))
