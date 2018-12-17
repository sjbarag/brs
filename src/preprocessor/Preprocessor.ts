import * as CC from "./Chunk";
import { ParseError } from "../parser";
import { Token, Lexeme } from "../lexer";
import * as BrsError from "../Error";

export class Preprocessor implements CC.Visitor {

    private constants = new Map<string, boolean>();

    filter(chunks: ReadonlyArray<CC.Chunk>) {
        return chunks.map(chunk => this.visit(chunk)).reduce(
           (allTokens: Token[], chunkTokens: Token[]) => [ ...allTokens, ...chunkTokens ],
           []
        );
    }

    visit(this: Preprocessor, chunk: CC.Chunk) {
        return chunk.accept(this);
    }

    visitBrightScript(chunk: CC.BrightScript) {
        return chunk.tokens;
    }

    visitDeclaration(chunk: CC.Declaration) {
        if (this.constants.has(chunk.name.text)) {
            return [];
        }

        let value;
        switch (chunk.value.kind) {
            case Lexeme.True:
                value = true;
                break;
            case Lexeme.False:
                value = false;
                break;
            case Lexeme.Identifier:
                if (this.constants.has(chunk.value.text)) {
                    value = this.constants.get(chunk.value.text) as boolean;
                    break;
                }

                throw BrsError.make(`Attempting to create #const alias of '${chunk.value.text}', but no such #const exists`, chunk.value.line);
            default:
                throw BrsError.make("#const declarations can only have values of `true`, `false`, or other #const names", chunk.value.line);
        }

        this.constants.set(chunk.name.text, value);

        return [];
    }

    visitError(chunk: CC.Error): never {
        throw ParseError.make(chunk.hashError, chunk.message);
    }

    visitIf(chunk: CC.If): Token[] {
        if (this.evaluateCondition(chunk.condition)) {
            return chunk.thenChunk.accept(this);
        } else {
            for (const elseIf of chunk.elseIfs) {
                if (this.evaluateCondition(elseIf.condition)) {
                    return elseIf.thenChunk.accept(this);
                }
            }
        }

        if (chunk.elseChunk) {
            return chunk.elseChunk.accept(this);
        }

        return [];
    }

    evaluateCondition(token: Token): boolean {
        // literal true and false return directly
        switch (token.kind) {
            case Lexeme.True: return true;
            case Lexeme.False: return false;
            case Lexeme.Identifier:
                if (this.constants.has(token.text)) {
                    return this.constants.get(token.text) as boolean;
                }

                throw BrsError.make(`Attempting to reference undefined #const with name '${token.text}'`, token.line);
            default:
                throw BrsError.make("#if conditionals can only be `true`, `false`, or other #const names", token.line);
        }
    }
}
