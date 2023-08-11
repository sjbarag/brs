sub Main()
    print("function in same file: " + sameFileFunc())
    print("function in different file: " + differentFileFunc())
    print("function with dependency: " + dependentFunc())
    print("test for optional chaining " + testOptionalChaining())
end sub

function sameFileFunc()
    return "from sameFileFunc()"
end function

function dependencyFunc()
    return "from dependencyFunc()"
end function

function testOptionalChaining()
    responseData = {
        data:{
            metricsData:{
                addOnsStepStart : "value"
            }
        }
    }
    result = responseData?.data.metricsData?.addOnsStepStart
    return result
end function
