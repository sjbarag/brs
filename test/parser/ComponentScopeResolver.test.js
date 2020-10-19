const brs = require("brs");
const path = require("path");
const { getComponentDefinitionMap } = require("../../lib/componentprocessor");
const { defaultExecutionOptions } = require("../../lib/interpreter");
const LexerParser = require("../../lib/LexerParser");

jest.mock("fast-glob");
jest.mock("fs");
const fg = require("fast-glob");
const fs = require("fs");

const realFs = jest.requireActual("fs");

describe("ComponentScopeResolver", () => {
    let parseFn, componentMap;

    beforeEach(async () => {
        fg.sync.mockImplementation(() => {
            return [
                "baseComponent.xml",
                "extendedComponent.xml",
                "baseComponentTwoScripts.xml",
                "extendedComponent2.xml",
                "scripts/baseComponent.brs",
                "scripts/extendedComponenet.brs",
                "scripts/utilityBase.brs",
                "scripts/utilityExtended.brs",
            ];
        });
        fs.readFile.mockImplementation((filename, _, cb) => {
            resourcePath = path.join(__dirname, "resources", filename);
            realFs.readFile(resourcePath, "utf8", (err, contents) => {
                cb(/* no error */ null, contents);
            });
        });

        parseFn = LexerParser.getLexerParserFn(new Map(), defaultExecutionOptions);

        componentMap = await getComponentDefinitionMap("/doesnt/matter");
        componentMap.forEach((comp) => {
            comp.scripts = comp.scripts.map((script) => {
                script.uri = path.join("scripts/", path.parse(script.uri).base);
                return script;
            });
        });
    });

    afterEach(() => {
        fg.sync.mockRestore();
        fs.readFile.mockRestore();
    });

    test("resolving function scope across two components", async () => {
        let componentToResolve = componentMap.get("extendedcomponent");
        let componentScopeResolver = new brs.parser.ComponentScopeResolver(componentMap, parseFn);
        let statements = await componentScopeResolver.resolve(componentToResolve);
        expect(statements).toBeDefined();

        let statementNames = statements.map((s) => s.name.text);
        expect(statementNames).toEqual(["test", "test2"]);

        let testStatement = statements.find((s) => s.name.text === "test");
        let testStatementCount = testStatement.func.body.statements.length;
        expect(testStatementCount).toEqual(2);
    });

    test("resolving function scope with multiple scripts", async () => {
        let componentToResolve = componentMap.get("extendedcomponent2");
        let componentScopeResolver = new brs.parser.ComponentScopeResolver(componentMap, parseFn);
        let statements = await componentScopeResolver.resolve(componentToResolve);
        expect(statements).toBeDefined();

        let statementNames = statements.map((s) => s.name.text);
        // Statements are in a specific order
        expect(statementNames).toEqual(["test", "util1", "util_y", "test2", "util_x"]);

        let testStatement = statements.find((s) => s.name.text === "util1");
        let testStatementCount = testStatement.func.body.statements.length;
        expect(testStatementCount).toEqual(2);
    });

    it("doesn't copy init into scope", async () => {
        let componentToResolve = componentMap.get("extendedcomponent");
        let componentScopeResolver = new brs.parser.ComponentScopeResolver(componentMap, parseFn);
        let statements = await componentScopeResolver.resolve(componentToResolve);
        expect(statements).toBeDefined();

        let statementNames = statements.map((s) => s.name.text);
        expect(statementNames).not.toContain("init");
    });
});
