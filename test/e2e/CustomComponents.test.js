const { execute } = require("../../lib");
const { createMockStreams, allArgs } = require("./E2ETests");
const lolex = require("lolex");
const brs = require("brs");
const { RoSGNode, BrsString, Callable, ValueKind } = brs.types;
const path = require("path");

class Foo extends RoSGNode {
    constructor(initializedFields = [], name = "Foo") {
        super([], name);
        this.name = name;

        this.registerDefaultFields(this.defaultFields);
        this.registerInitializedFields(initializedFields);

        this.sayHello = new Callable("sayHello", {
            signature: {
                args: [],
                returns: ValueKind.String,
            },
            impl: (_interpreter) => {
                return new BrsString("Foo Says Hello world");
            },
        });

        this.registerMethods({
            ifHelloWorld: [this.sayHello],
        });
    }
}

describe("Extending custom components", () => {
    let outputStreams;

    beforeAll(() => {
        brs.types.ComponentFactory.addComponentTypes([["Foo", (name) => new Foo([], name)]]);
        brs.types.extendBrsObjects([["Foo", (_interpreter) => new Foo()]]);

        outputStreams = createMockStreams();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test("components/ExtendCustom.brs", async () => {
        outputStreams.root = path.join(__dirname, "customResources");
        let customFile = path.join(
            __dirname,
            "customResources",
            "components",
            "extendCustomMain.brs"
        );
        await execute([customFile], outputStreams);

        expect(allArgs(outputStreams.stdout.write).filter((arg) => arg !== "\n")).toEqual([
            "ExtendCustom init",
            "Foo Says Hello world",
        ]);
    });
});
