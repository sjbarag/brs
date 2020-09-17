import {
    BrsInvalid,
    BrsType,
    Callable,
    StdlibArgument,
    ValueKind,
    RoSGNode,
    FieldModel,
    SignatureAndImplementation,
    BrsString,
    RoArray,
} from "../brsTypes";
import { Interpreter } from "../interpreter";
import { Stmt } from "../parser";

export class MockFunction extends RoSGNode {
    readonly defaultFields: FieldModel[] = [
        { name: "calls", type: "array" },
        { name: "results", type: "array" },
    ];
    private func: Callable;
    private name: BrsString;

    constructor(name: BrsString, func: Callable) {
        super([], "MockFunction");
        this.name = name;
        this.func = func;

        this.registerDefaultFields(this.defaultFields);
        this.appendMethods([this.mockReset, this.getMockName]);
    }

    private addCall(interpreter: Interpreter, args: any[]) {
        let calls = this.get(new BrsString("calls"));
        if (calls instanceof RoArray) {
            let push = calls.getMethod("push");
            push?.call(interpreter, new RoArray(args));
        }
    }

    private addResult(interpreter: Interpreter, value: BrsType) {
        let results = this.get(new BrsString("results"));
        if (results instanceof RoArray) {
            let push = results.getMethod("push");
            push?.call(interpreter, value);
        }
    }

    /**
     * Wraps the original function implementation so that it can keep track of each call.
     */
    createMockFunction(): Callable {
        let signatures: SignatureAndImplementation[] = this.func.signatures.map((sigAndImpl) => {
            return {
                signature: sigAndImpl.signature,
                impl: (interpreter: Interpreter, ...args: any[]) => {
                    this.addCall(interpreter, args);
                    let result: BrsType = BrsInvalid.Instance;
                    try {
                        result = this.func.call(interpreter, ...args);
                    } catch (err) {
                        if (err instanceof Stmt.ReturnValue && err.value) {
                            this.addResult(interpreter, err.value);
                        }
                        // re-throw error to continue normal execution
                        throw err;
                    }

                    this.addResult(interpreter, result);
                    return result;
                },
            };
        });
        return new Callable(this.name.value, ...signatures);
    }

    /** Clears the calls array and results array. */
    private mockReset = new Callable("mockReset", {
        signature: {
            args: [],
            returns: ValueKind.Invalid,
        },
        impl: (interpreter: Interpreter) => {
            ["calls", "results"].forEach((fieldName) => {
                let field = this.get(new BrsString(fieldName));
                if (field instanceof RoArray) {
                    let clear = field.getMethod("clear");
                    clear?.call(interpreter);
                }
            });

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
}

export const mockFunction = new Callable("mockFunction", {
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
});
