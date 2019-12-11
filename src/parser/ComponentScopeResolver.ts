import { ComponentDefinition } from "../componentprocessor";
import * as Stmt from "./Statement";
import { statement } from "@babel/template";

export class ComponentScopeResolver {
    /**
     * @param componentMap Component definition map to reference for function resolution.
     * @param parserLexerFn Function used to parse statements out of given components
     */
    constructor(
        readonly componentMap: Map<string, ComponentDefinition>,
        readonly parserLexerFn: (filenames: string[]) => Promise<Stmt.Statement[]> // TODO: Remove and just build here?
    ) {}

    /**
     * Resolves the component functions in scope based on the extends hierarchy.
     * @param component Instance of the component to resolve function scope for.
     * @returns All statements in scope for the resolved component
     */
    public async resolve(component: ComponentDefinition): Promise<Stmt.Statement[]> {
        return Promise.all(this.getStatements(component)).then(this.flatten);
    }

    /**
     * Takes a sequence of statement collections and flattens them into a
     * single statement collection. This function assumes that the components
     * given in the statement map are in order of hierarchy with the furthest
     * inheriting component first.
     * @param statementMap Statement collections broken up by component.
     * @returns A collection of statements that have been flattened based on hierarchy.
     */
    private flatten(statementMap: Stmt.Statement[][]): Stmt.Statement[] {
        let statements = statementMap.shift() || [];
        let statementMemo = new Set(
            statements.filter((_): _ is Stmt.Function => true).map(statement => statement.name.text)
        );
        while (statementMap.length > 0) {
            let extendedFns = statementMap.shift() || [];
            statements = statements.concat(
                extendedFns
                    .filter((_): _ is Stmt.Function => true)
                    .filter(statement => {
                        let haveFnName = statementMemo.has(statement.name.text);
                        if (!haveFnName) {
                            statementMemo.add(statement.name.text);
                        }
                        return !haveFnName;
                    })
            );
        }
        return statements;
    }

    /**
     * Generator function that walks the component hierarchy and produces an
     * ordered list of component statement collections.
     * @param component Component to begin statement aggregation chain.
     * @returns An ordered array of component statement arrays.
     */
    private *getStatements(component: ComponentDefinition) {
        yield this.parserLexerFn(component.scripts.map(c => c.uri));
        let currentComponent: ComponentDefinition | undefined = component;
        while (currentComponent.extends) {
            let previousComponent = currentComponent;
            currentComponent = this.componentMap.get(currentComponent.extends);
            if (!currentComponent) {
                return Promise.reject({
                    message: `Cannot find extended component ${previousComponent.extends} defined on ${previousComponent.name}`,
                });
            }
            yield this.parserLexerFn(currentComponent.scripts.map(c => c.uri));
        }

        return Promise.resolve();
    }
}
