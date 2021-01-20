import type { BrsType } from "../brsTypes";
import type { Location } from "../lexer";
import { BrsError } from "../Error";

/** Marker class for errors thrown to exit block execution early. */
export class BlockEnd extends BrsError {}

/** An error thrown to exit a for loop early. */
export class ExitForReason extends BlockEnd {
    constructor(location: Location) {
        super("`exit for` encountered", location);
    }
}

/** An error thrown to exit a while loop early. */
export class ExitWhileReason extends BlockEnd {
    constructor(location: Location) {
        super("`exit while` encountered", location);
    }
}

/** An error thrown to handle a `return` statement. */
export class ReturnValue extends BlockEnd {
    constructor(readonly location: Location, readonly value?: BrsType) {
        super("`return` encountered", location);
    }
}

/** Any error code provided by the reference brightscript implementation. */
type ErrorCode = {
    /** The unique ID of the error. */
    errno: number;
    /** The human-readable version */
    message: string;
};

export const RuntimeErrorCode = {
    NextWithoutFor: {
        errno: 0,
        message: "Attempted to use `next` keyword outside the context of a `for` loop.",
    },
    BadSyntax: {
        message: "A syntax error not covered by any other error code.",
        errno: 2,
    },
    ReturnedWithoutGosub: {
        message: "Attempted to use a Gosub statement without a return inside the subroutine.",
        errno: 4,
    },
    OutOfData: {
        message: "Ran out of data while performing read operation.",
        errno: 6,
    },
    BadFunctionOrArrayParam: {
        message: "Attempted to use a definitely-not-valid function or array parameter ()",
        errno: 8,
    },
    OutOfMemory: {
        message: "The BrightScript runtime has run out of memory.",
        errno: 12,
    },
    MissingLineNumber: {
        message: "Meaning unclear; not documented in RBI.",
        errno: 15,
    },
    IndexOutOfBounds: {
        message: "Attempted to use out-of-bounds index into array.",
        errno: 16,
    },
    RedimensionArray: {
        message: "Attempted to re-`dim` an array that was already `dim`-ed.",
        errno: 18,
    },
    DivideByZero: {
        message: "Attempted to divide any value by zero.",
        errno: 20,
    },
    TypeMismatch: {
        message: "Attempted to use type A where type B explicitly required.",
        errno: 24,
    },
    BadFormatSpec: {
        message: "Attempted to use a format specifier that isn't valid.",
        errno: 24,
    },
    OutOfStorage: {
        message: "Unable to write to persistent storage, because the device has run out of space.",
        errno: 26,
    },
    StringToLong: {
        message: "Meaning unclear; not documented in RBI.",
        errno: 28,
    },
    BadBitShift: {
        message: "Attempted to perform a bitshift operation with a disallowed shift distance.",
        errno: 30,
    },
    NoContinue: {
        message: "Attempted to use `continue` statement, but it isn't supported.",
        errno: 32,
    },
    OutOfRange: {
        message: "Attempted to declare a constant with a value outside the allowed range.",
        errno: 34,
    },
    ExecutionTimeout: {
        message: "Execution of a statement took too long on the main or render thread.",
        errno: 35,
    },
    MalformedThrow: {
        message: "Attempted to throw an error that isn't structured properly.",
        errno: 38,
    },
    UserDefined: {
        message: "Any user-defined error.",
        errno: 40,
    },
    TryContainsLabel: {
        message: "Encountered a `goto`-style label within a `try` block, which is not supported.",
        errno: 143,
    },
    EvalDisabled: {
        message: "Encountered a call to `eval()`, but that function has been disabled.",
        errno: 144,
    },
    FunctionNotFound: {
        message: "Attempted to access a function that doesn't exist in the requested object.",
        errno: 145,
    },
    NameShadowsBuiltin: {
        message: "Encountered a variable or function name that shadows a built-in function.",
        errno: 157,
    },
    FoldingConstant: {
        message: "Meaning unclear; not documented in RBI.",
        errno: 158,
    },
    BadConstName: {
        message: "Encountered a malformed conditional-compilation constant.",
        errno: 159,
    },
    VarShadowsFunctionName: {
        message:
            "Encountered a variable declaration that has the same name as a subroutine in the same scope.",
        errno: 160,
    },
    LabelLimitExceeded: {
        message: "More `goto`-style labels were created than are currently supported.",
        errno: 161,
    },
    MissingRo: {
        message: "Meaning unclear; not documented in RBI.",
        errno: 162,
    },
    InterfaceTooLarge: {
        message: "Meaning unclear; not documented in RBI.",
        errno: 163,
    },
    NoInitializer: {
        message: "Expected a variable initializer, but one wasn't found.",
        errno: 164,
    },
    ExitForWithoutFor: {
        message: "Encountered an `exit for` statement outside the context of a `for` loop.",
        errno: 165,
    },
    Deprecated: {
        message: "Executed a statement or evaluated an expression that's not supported anymore.",
        errno: 166,
    },
    BadType: {
        message: "Encountered a type declaration that uses a malformed type name.",
        errno: 167,
    },
    MissingReturnType: {
        message: "Encountered a function declaration without a return type where one is required.",
        errno: 168,
    },
    ReturnWithoutValue: {
        message: "Encountered a  `return` statement without a return value where one is required.",
        errno: 169,
    },
    ReturnWithValue: {
        message: "Encountered a `return` statement with a return value where one isn't allowed.",
        errno: 170,
    },
    TypeMismatchForEachIndex: {
        message:
            "Attempted to perform a `for each` loop across an object that can't be indexed with integers.",
        errno: 171,
    },
    MissingMainFunction: {
        message: "Unable to find a `main` function to execute.",
        errno: 172,
    },
    DuplicateSub: {
        message: "Encountered a `sub` name that's already declared elsewhere in this scope.",
        errno: 173,
    },
    LimitExceeded: {
        message:
            "Exceeded some implementation-specific limit, e.g. encountered too many conditions in a single `if` expression.",
        errno: 174,
    },
    ExitWhileWithoutWhile: {
        message: "Encountered an `exit while` statement outside the context of a `while` block.",
        errno: 175,
    },
    TooManyVariables: {
        message: "More variables were initialized than are currently supported.",
        errno: 176,
    },
    TooManyConstants: {
        message: "More constants were declared than are currently supported.",
        errno: 177,
    },
    FunctionNotExpected: {
        message: "Encountered a function declaration where one wasn't expected.",
        errno: 178,
    },
    UnterminatedString: {
        message: `Encountered a string that wasn't closed by a second '"' before the end of its line.`,
        errno: 179,
    },
    DuplicateLabel: {
        message: "Encountered `goto`-style label that was already declared elsewhere.",
        errno: 180,
    },
    UnteriminatedBlock: {
        message:
            "Encountered a block (`if`, `while`, `function`, etc.) that isn't properly terminated.",
        errno: 181,
    } /** Attempted to use `next var`, but `var` isn't the enclosing `for` statement's loop variable.*/,
    BadNext: 182,
    EndOfFile: {
        message:
            "Detected the end of the current file when it wasn't expected (typically while parsing other constructs).",
        errno: 183,
    },
    BadMatch: {
        message: "Encountered a `match` statement that didn't match its intended target.",
        errno: 184,
    },
    CannotReadFile: {
        message: "Encountered an error while reading a file.",
        errno: 185,
    },
    LineNumberSequenceError: {
        message: "Encountered a file with line numbers out of order.",
        errno: 186,
    },
    NoLineNumber: {
        message: "Unable to find a line number for a particular statement.",
        errno: 187,
    },
    IfWithoutEndIf: {
        message: "Encountered an `if` block that wasn't terminated by an `end if` statement.",
        errno: 189,
    },
    WhileWithoutEndWhile: {
        message: "Encountered a `while` block that wasn't terminated by an `end while` statement.",
        errno: 190,
    },
    EndWhileWithoutWhile: {
        message: "Encountered an `end while` statement outside the context of a `while` block.",
        errno: 191,
    },
    ExceptionThrownOnStack: {
        message: "Use is unclear and nearly undocumented in RBI.",
        errno: 222,
    },
    StackOverflow: {
        message: "~Uploaded ~/Pictures to stackoverflow.com~ Call stack exceeded maximum height.",
        errno: 223,
    },
    NotAFunction: {
        message: "Attempted to call a value that isn't actually a function.",
        errno: 224,
    },
    UnsupportedUnicode: {
        message: "Attempted to use a unicode character in an unsupported way.",
        errno: 225,
    },
    ValueReturn: {
        message:
            "Any return statement that pops a function call off the call stack (including void returns).",
        errno: 226,
    },
    BadNumberOfIndexes: {
        message: "Attempted to use an unsupported number of indexes into an array.",
        errno: 227,
    },
    BadLHS: {
        message: "Attempted to use invalid left-hand side for a binary expression.",
        errno: 228,
    },
    MissingReturnValue: {
        message: "Detected a function that requires a `return` statement but doesn't have one.",
        errno: 229,
    },
    UninitializedFunction: {
        message: "Attempted to reference an uninitialized function.",
        errno: 230,
    },
    UndimmedArray: {
        message: "Attempted to use an array that was never `dim`d or otherwise initialized.",
        errno: 231,
    },
    NonNumericArrayIndex: {
        message: "Attempted to index into an array with non-numeric value.",
        errno: 232,
    },
    UninitializedVariable: {
        message: "Attempted to use an uninitialized variable in an unsupported way.",
        errno: 233,
    },
    TypelessOperation: {
        message: "Attempted to perform operation on two operands without types.",
        errno: 235,
    },
    DotOnNonObject: {
        message:
            "Attempted to use a dot (`.`) to dereference a non-object, non-interface variable.",
        errno: 236,
    },
    NonStaticInterfaceCall: {
        message: "Attempted to call non-static function defined on an roInterface.",
        errno: 237,
    },
    NotWaitable: {
        message:
            "Called `wait` on an object that doesn't implement ifMessagePort, and thus can't be waited for.",
        errno: 238,
    },
    NotPrintable: {
        message: "Attempted to `print` a value that can't be printed.",
        errno: 239,
    },
    ReturnValueIgnored: {
        message: "Called function returns a value, but that value isn't used here.",
        errno: 240,
    },
    WrongNumberOfParams: {
        message: "Attempted to call function with incorrect number of parameters.",
        errno: 241,
    },
    TooManyParams: {
        message: "Encountered more function parameters than are supported.",
        errno: 242,
    },
    InterfaceIsntAMember: {
        message: "Attempted to operate on an interface that isn't a member of an object.",
        errno: 243,
    },
    MemberFunctionNotFound: {
        message: "Attempted to call interface or member function that does not exist.",
        errno: 244,
    },
    RoWrongNumberOfParams: {
        message: "Attempted to call ro function with incorrect number of parameters.",
        errno: 245,
    },
    ObjectClassNotFound: {
        message: "Could not create new component, because the object class could not be found.",
        errno: 246,
    },
    Stop: {
        message: "Excecuted a `stop` statement (unimplemented in this project)",
        errno: 247,
    },
    Break: {
        message: "Called scriptBreak() function (unimplemented in this project).",
        errno: 248,
    },
    StackUnderflow: {
        message: "Attempted to pop something off the call stack, but there's nothing to pop.",
        errno: 249,
    },
    MissingParenthesis: {
        message: "Detected a missing parenthesis during parsing.",
        errno: 250,
    },
    UndefinedOperator: {
        message: "Encountered an unsupported expression operator.",
        errno: 251,
    },
    NormalEnd: {
        message: "Execution has ended, typically via the `END` keyword.",
        errno: 252,
    },
    UndfefinedOpCode: {
        message: "Encountered an opcode that isn't supported in this project.",
        errno: 253,
    },
    Internal: {
        message: "Any issue internal to the interpreter itself.",
        errno: 254,
    },
    Okay: {
        message: "Everything is fine.",
        errno: 255,
    },
};

/** An error thrown when a BrightScript runtime error is encountered. */
export class Runtime extends BlockEnd {
    constructor(readonly errno: ErrorCode, message: string, location: Location) {
        super(message, location);
    }
}
