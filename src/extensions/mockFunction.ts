import {
    BrsInvalid,
    BrsType,
    Callable,
    StdlibArgument,
    ValueKind,
    SignatureAndImplementation,
    BrsString,
    RoArray,
    RoAssociativeArray,
} from "../brsTypes";
import { Interpreter } from "../interpreter";
import { Stmt } from "../parser";

export class MockFunction extends RoAssociativeArray {
    private calls = new RoArray([]);
    private results = new RoArray([]);
    private func: Callable;
    private name: BrsString;

    constructor(name: BrsString, func: Callable) {
        super([]);

        this.name = name;
        this.func = func;

        this.set(new BrsString("calls"), this.calls);
        this.set(new BrsString("clearMock"), this.clearMock);
        this.set(new BrsString("getMockName"), this.getMockName);
        this.set(new BrsString("mockReturnValue"), this.mockReturnValue);
        this.set(new BrsString("results"), this.results);
    }

    /**
     * Wraps the original function implementation so that it can keep track of each call.
     */
    createMockFunction(): Callable {
        let signatures: SignatureAndImplementation[] = this.func.signatures.map((sigAndImpl) => {
            return {
                signature: sigAndImpl.signature,
                impl: (interpreter: Interpreter, ...args: any[]) => {
                    // add the arguments to our calls array
                    this.calls.getValue().push(new RoArray(args));

                    let result: BrsType = BrsInvalid.Instance;
                    try {
                        result = this.func.call(interpreter, ...args);
                    } catch (err) {
                        if (err instanceof Stmt.ReturnValue && err.value) {
                            // add the result to our results array
                            this.results.getValue().push(err.value);
                        }
                        // re-throw error to continue normal execution
                        throw err;
                    }

                    // add the result to our results array
                    this.results.getValue().push(result);

                    return result;
                },
            };
        });
        return new Callable(this.name.value, ...signatures);
    }

    /** Clears the calls array and results array. */
    private clearMock = new Callable("clearMock", {
        signature: {
            args: [],
            returns: ValueKind.Invalid,
        },
        impl: (interpreter: Interpreter) => {
            this.calls.getMethod("clear")?.call(interpreter);
            this.results.getMethod("clear")?.call(interpreter);
            return BrsInvalid.Instance;
        },
    });

    /** Returns the name of the function that's being mocked. */
    private getMockName = new Callable("getMockName", {
        signature: {
            args: [],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter) => {
            return this.name;
        },
    });

    /** Overwrites the mock implementation and returns a new value. */
    private mockReturnValue = new Callable("mockReturnValue", {
        signature: {
            args: [new StdlibArgument("returnValue", ValueKind.Dynamic)],
            returns: ValueKind.String,
        },
        impl: (interpreter: Interpreter, returnValue: BrsType) => {
            this.func = new Callable(
                this.name.toString(),
                ...Callable.variadic({
                    signature: {
                        args: [],
                        returns: returnValue.kind,
                    },
                    impl: (interpreter: Interpreter, ...args: BrsType[]) => {
                        return returnValue;
                    },
                })
            );

            interpreter.environment.setMockFunction(
                this.name.toString(),
                this.createMockFunction()
            );

            return BrsInvalid.Instance;
        },
    });
}

export const mockFunction = new Callable(
    "mockFunction",
    ...[
        {
            signature: {
                args: [new StdlibArgument("functionToMock", ValueKind.String)],
                returns: ValueKind.Invalid,
            },
            impl: (interpreter: Interpreter, functionToMock: BrsString) => {
                // Create a function that accepts any number of parameters and returns invalid.
                let mock = new Callable(
                    functionToMock.toString(),
                    ...Callable.variadic({
                        signature: {
                            args: [],
                            returns: ValueKind.Invalid,
                        },
                        impl: (interpreter: Interpreter) => {
                            return BrsInvalid.Instance;
                        },
                    })
                );

                let mockFunctionNode = new MockFunction(functionToMock, mock);
                interpreter.environment.setMockFunction(
                    functionToMock.toString(),
                    mockFunctionNode.createMockFunction()
                );

                return mockFunctionNode;
            },
        },
        {
            signature: {
                args: [
                    new StdlibArgument("functionToMock", ValueKind.String),
                    new StdlibArgument("mock", ValueKind.Callable),
                ],
                returns: ValueKind.Invalid,
            },
            impl: (interpreter: Interpreter, functionToMock: BrsString, mock: Callable) => {
                let mockFunctionNode = new MockFunction(functionToMock, mock);
                interpreter.environment.setMockFunction(
                    functionToMock.toString(),
                    mockFunctionNode.createMockFunction()
                );

                return mockFunctionNode;
            },
        },
    ]
);
