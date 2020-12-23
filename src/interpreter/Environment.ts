import { Identifier } from "../lexer";
import { BrsType, RoAssociativeArray, Int32, BrsInvalid, RoSGNode, Callable } from "../brsTypes";
import { ComponentDefinition } from "../componentprocessor";
import { BrsError } from "../Error";

/** The logical region from a particular variable or function that defines where it may be accessed from. */
export enum Scope {
    /** The set of native functions that are always accessible, e.g. `RebootSystem`. */
    Global,
    /** The set of named functions accessible from a set of files compiled together. */
    Module,
    /** The set of variables (including anonymous functions) accessible *only* from within a function body. */
    Function,
}

/** An error thrown when attempting to access an uninitialized variable. */
export class NotFound extends Error {
    constructor(reason: string) {
        super(reason);
    }
}

/** Holds a set of values in multiple scopes and provides access operations to them. */
export class Environment {
    constructor(rootM?: RoAssociativeArray) {
        if (!rootM) {
            this.rootM = this.mPointer;
        } else {
            this.rootM = rootM;
        }
    }
    /**
     * Functions that are always accessible.
     * @see Scope.Global
     */
    private global = new Map<string, BrsType>();
    /**
     * Named functions that are compiled together into a single module.
     * @see Scope.Module
     */
    private module = new Map<string, BrsType>();
    /**
     * Variables and anonymous functions accessible only within a function's body.
     * @see Scope.Function
     */
    private function = new Map<string, BrsType>();
    /**
     * Mocked objects
     */
    private mockObjects = new Map<string, RoAssociativeArray>();
    /**
     * Unscoped mock functions. These mocks are used across all components and files.
     */
    private unscopedMockFunctions = new Map<string, Callable>();
    /**
     * Scoped mock functions. These mocks are only used in this component.
     */
    private scopedMockFunctions = new Map<string, Callable>();
    /** The BrightScript `m` pointer, analogous to JavaScript's `this` pointer. */
    private mPointer = new RoAssociativeArray([]);
    private rootM: RoAssociativeArray;
    /**
     * The one true focus of the scenegraph app, only one component can have focus at a time.
     * Note: this focus is only meaningful if the node being set focus to
     * is a child of the main scene graph tree.  Otherwise, it will not follow the rule
     * of stealing focus away from another node if a new node got focus.
     */
    private focusedNode: RoSGNode | BrsInvalid = BrsInvalid.Instance;

    /** Map holding component definitions of all parsed xml component files */
    public nodeDefMap = new Map<string, ComponentDefinition>();

    /** The node in which field-change observers are registered. */
    public hostNode: RoSGNode | undefined;

    /**
     * Stores a `value` for the `name`d variable in the provided `scope`.
     * @param scope The logical region from a particular variable or function that defines where it may be accessed from
     * @param name the name of the variable to define (in the form of an `Identifier`)
     * @param value the value of the variable to define
     */
    public define(scope: Scope, name: string, value: BrsType): void {
        let destination: Map<string, BrsType>;

        switch (scope) {
            case Scope.Function:
                destination = this.function;
                break;
            case Scope.Module:
                destination = this.module;
                break;
            default:
                destination = this.global;
                break;
        }

        destination.set(name.toLowerCase(), value);
    }

    /**
     * Sets the value of the special `m` variable, which is analogous to JavaScript's `this`.
     * @param newMPointer the new value to be used for the `m` pointer
     */
    public setM(newMPointer: RoAssociativeArray): void {
        this.mPointer = newMPointer;
    }

    /**
     * Retrieves the current value of the special `m` variable, which is analogous to JavaScript's `this`.
     * @returns the current value used for the `m` pointer.
     */
    public getM(): RoAssociativeArray {
        return this.mPointer;
    }

    /**
     * Retrieves the the special `m` variable from the root Environment.
     * @returns the current value used for the root `m` pointer.
     */
    public getRootM(): RoAssociativeArray {
        return this.rootM;
    }

    /**
     * Sets the the special `m` variable from the root Environment.
     * @param newMPointer the new value to be used for the `m` pointer
     */
    public setRootM(newMPointer: RoAssociativeArray): void {
        this.rootM = newMPointer;
    }

    /**
     * Removes a variable from this environment's function scope.
     * @param name the name of the variable to remove (in the form of an `Identifier`)
     * @param scope the scope to remove this variable from (defaults to "function")
     */
    public remove(name: string, scope: Scope = Scope.Function): void {
        let lowercaseName = name.toLowerCase();
        switch (scope) {
            case Scope.Module:
                this.module.delete(lowercaseName);
                break;
            case Scope.Function:
                this.function.delete(lowercaseName);
                break;
            default:
                break;
        }
    }

    /**
     * Retrieves a variable from this environment, checking each internal scope in order of precedence.
     * @param name the name of the variable to retrieve (in the form of an `Identifier`)
     * @returns the value stored for `name` if any exist
     * @throws a `NotFound` error if no value is stored for `name`
     */
    public get(name: Identifier): BrsType {
        let lowercaseName = name.text.toLowerCase();

        // the special "LINE_NUM" variable always resolves to the line number on which it appears
        if (lowercaseName === "line_num") {
            return new Int32(name.location.start.line);
        }

        // "m" always maps to the special `m` pointer
        if (lowercaseName === "m") {
            return this.mPointer;
        }

        let source = [this.function, this.module, this.global].find((scope) =>
            scope.has(lowercaseName)
        );

        if (source) {
            let variableToReturn = source.get(lowercaseName)!;
            if (
                source !== this.function &&
                this.isMockedFunction(variableToReturn, lowercaseName)
            ) {
                variableToReturn = this.getMockFunction(lowercaseName);
            }
            return variableToReturn;
        } else {
            // Don't allow mocks of reserved functions like "init" and "main".
            if (!name.isReserved) {
                let mockedFunc = this.getMockFunction(lowercaseName);
                if (mockedFunc !== BrsInvalid.Instance) {
                    return mockedFunc;
                }
            }
        }

        throw new NotFound(`Undefined variable '${name.text}'`);
    }

    /**
     * Determines whether or not a variable exists in this environment.
     * @param name the name of the variable to search for (in the form of an `Identifier`)
     * @param scopeFilter the set of scopes with which to limit searches for `name`
     * @returns `true` if this environment contains `name`, otherwise `false`
     */
    public has(
        name: Identifier,
        scopeFilter: Scope[] = [Scope.Global, Scope.Module, Scope.Function]
    ): boolean {
        if (name.text.toLowerCase() === "m") {
            return true; // we always have an `m` scope of some sort!
        }

        let lowercaseName = name.text.toLowerCase();
        return (
            scopeFilter
                .map((scopeName) => {
                    switch (scopeName) {
                        case Scope.Global:
                            return this.global;
                        case Scope.Module:
                            return this.module;
                        case Scope.Function:
                            return this.function;
                    }
                })
                .find((scope) => scope.has(lowercaseName)) != null
        );
    }

    /**
     * Creates a clone of the current environment, but without its function-scoped
     * values. Useful for creating sub-environments.
     *
     * The Reference BrightScript Implementation (RBI) doesn't currently create closures when
     * functions are created.  When a function is called, it has access only to:
     *
     * 1. Globally-defined functions (e.g. `RebootSystem`, `UCase`, et. al.)
     * 2. Named functions compiled together into a single "module"
     * 3. Parameters passed into the function
     * 4. The `m` pointer, defined by the way in which a function was called
     * 5. Currently focused node object that reacts to onKey button presses
     * @param includeModuleScope whether or not to includer caller's module scope into
     * the cloned environment.
     *
     * @returns a copy of this environment but with no function-scoped values.
     */
    public createSubEnvironment(includeModuleScope: boolean = true): Environment {
        let newEnvironment = new Environment(this.rootM);
        newEnvironment.global = new Map(this.global);
        newEnvironment.mPointer = this.mPointer;
        newEnvironment.mockObjects = this.mockObjects;
        newEnvironment.unscopedMockFunctions = this.unscopedMockFunctions;
        newEnvironment.focusedNode = this.focusedNode;
        newEnvironment.nodeDefMap = this.nodeDefMap;
        newEnvironment.hostNode = this.hostNode;

        if (includeModuleScope) {
            newEnvironment.module = new Map(this.module);
            newEnvironment.scopedMockFunctions = this.scopedMockFunctions;
        } else {
            newEnvironment.module = new Map<string, BrsType>();
            newEnvironment.scopedMockFunctions = new Map<string, Callable>();
        }

        return newEnvironment;
    }

    /**
     * returns true if the variable has a mocked object
     * @param objName the object to mock
     */
    public isMockedObject(objName: string): boolean {
        return this.mockObjects.has(objName);
    }

    /**
     * retrieves mocked object if it exists
     * @param objName the object to mock
     */
    public getMockObject(objName: string): BrsType {
        return this.mockObjects.get(objName) || BrsInvalid.Instance;
    }

    /**
     * places the mockValue object into list of mocks
     * @param objName the object we are mocking
     * @param mockValue the mock to return
     */
    public setMockObject(objName: string, mockValue: RoAssociativeArray): void {
        this.mockObjects.set(objName.toLowerCase(), mockValue);
    }

    /**
     * places the mockValue function into list of mocks
     * @param functionName the function we are mocking
     * @param mockValue the mock to return
     * @param isScoped whether this function should be scoped to this module or universally mocked.
     */
    public setMockFunction(
        functionName: string,
        mockValue: Callable,
        isScoped: boolean = false
    ): void {
        if (isScoped) {
            this.scopedMockFunctions.set(functionName.toLowerCase(), mockValue);
        } else {
            this.unscopedMockFunctions.set(functionName.toLowerCase(), mockValue);
        }
    }

    /**
     * Retrieves mocked function if it exists. If there is a scoped and unscoped function
     * by the same name, it will return the scoped.
     * @param functionName the function to mock
     */
    public getMockFunction(functionName: string): Callable | BrsInvalid {
        if (this.scopedMockFunctions.has(functionName)) {
            return this.scopedMockFunctions.get(functionName)!;
        }

        return this.unscopedMockFunctions.get(functionName) || BrsInvalid.Instance;
    }

    /**
     * returns true if the variable has a mocked function
     * @param possibleMockFunction the variable that may be mocked
     * @param possibleMockName the identifier/name for the mocked function
     */
    private isMockedFunction(possibleMockFunction: BrsType, possibleMockName: string): boolean {
        return (
            possibleMockFunction instanceof Callable &&
            (this.scopedMockFunctions.has(possibleMockName) ||
                this.unscopedMockFunctions.has(possibleMockName))
        );
    }

    /**
     * resets all of the mocked functions and objects in this environment
     */
    public resetMocks() {
        this.resetMockObjects();
        this.resetUnscopedMockFunctions();
    }

    /**
     * resets all of the mocked objects in this environment
     */
    public resetMockObjects() {
        this.mockObjects.forEach((mock, name) => {
            this.resetMockObject(name);
        });
        this.mockObjects.clear();
    }

    /**
     * resets a single mocked object in this environment
     */
    public resetMockObject(name: string) {
        name = name.toLowerCase();
        // Since partial-component mocks are actually just scoped function mocks,
        // we need to go into this node's environment and remove all of the scoped mocks.
        let nodeDef = this.nodeDefMap.get(name);
        nodeDef?.environment?.resetScopedMockFunctions();

        this.mockObjects.delete(name);
    }

    /**
     * reset the unscoped (globally mocked) function that matches the given name
     */
    public resetUnscopedMockFunction(name: string) {
        this.unscopedMockFunctions.delete(name.toLowerCase());
    }

    /**
     * resets all of the unscoped (globally mocked) functions
     */
    public resetUnscopedMockFunctions() {
        this.unscopedMockFunctions.clear();
    }

    /**
     * reset the scoped (this environment only) function that matches the given name
     */
    public resetScopedMockFunction(name: string) {
        this.scopedMockFunctions.delete(name.toLowerCase());
    }

    /**
     * resets all of the mocked functions *in this environment*
     */
    public resetScopedMockFunctions() {
        this.scopedMockFunctions.clear();
    }

    /**
     * Sets the currently focused node, which reacts to onKey button presses
     * @param node either node object or invalid
     */
    public setFocusedNode(node: RoSGNode | BrsInvalid) {
        this.focusedNode = node;
    }

    /**
     * Gets the currently focused node, which reacts to onKey button presses
     * @returns currently focused node
     */
    public getFocusedNode(): RoSGNode | BrsInvalid {
        return this.focusedNode;
    }
}
