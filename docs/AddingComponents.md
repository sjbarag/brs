## Guidelines for adding components to `brs`

This is aimed to be a quick guide for adding a component to `brs`. Note that this may not be comprehensive in all cases, but is a general plan of attack. Here are the steps you should take:

1. Find the documentation for your component on [Roku's developer docs](https://developer.roku.com). For example, the documentation for the `Group` component can be found [here](https://developer.roku.com/en-gb/docs/references/scenegraph/layout-group-nodes/group.md).
1. Create a file in the [components directory](https://github.com/sjbarag/brs/tree/main/src/brsTypes/components) called `<insert component name>.ts`.
1. Copy the following code and paste it into your new file:

    ```
    import { FieldModel } from "./RoSGNode";
    import { AAMember } from "./RoAssociativeArray";

    export class <insert component name> extends <insert parent component> {
        readonly defaultFields: FieldModel[] = [
            // Add built-in fields here.
            // The fields can be found on the Roku docs.
        ];

        constructor(initializedFields: AAMember[] = [], readonly name: string = "<insert component name>") {
            super([], name);

            this.registerDefaultFields(this.defaultFields);
            this.registerInitializedFields(initializedFields);
        }
    }
    ```

1. Replace all `<insert component name>` and `<insert parent component>` from above with your component name. Add any built-in fields and/or class functions that the Roku docs specify.
1. Add a constructor definition to the [component factory](https://github.com/sjbarag/brs/blob/main/src/brsTypes/components/ComponentFactory.ts). This will allow instances of your new component to be created dynamically when it is encountered in XML or BrightScript code.
1. Add a test case for your Typescript class in [the components test directory](https://github.com/sjbarag/brs/tree/main/test/brsTypes/components). Use the existing component test files in that directory as a model for what your test should look like.
1. Add an end-to-end test case.
    - Create a file in [the end-to-end directory](https://github.com/sjbarag/brs/tree/main/test/e2e) called `<insert component name>.brs`. In the file, write BrightScript code that exercises your component functionality.
    - Add an XML file to the [the components test directory](https://github.com/sjbarag/brs/tree/main/test/brsTypes/components) that uses your component.
    - Add a test block to [BrsComponents.test.js](https://github.com/sjbarag/brs/blob/main/test/e2e/BrsComponents.test.js). In this block, verify that the code from your XML and Brightscript files is behaving as expected.
