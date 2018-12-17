import * as CC from "./Chunk";
import { ParseError } from "../parser";
import { Token } from "../lexer";

export function filter(chunks: CC.Chunk[]) {
}

class Preprocessor implements CC.Visitor {

    filter(chunks: CC.Chunk[]) {
        return chunks.map(this.visit).reduce(
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
        // TODO: process this declaration
        return [];
    }

    visitError(chunk: CC.Error): never {
        throw ParseError.make(chunk.hashError, chunk.message);
    }

    visitIf(chunk: CC.If) {
        // todo evaluate the if
        return [];
    }

}
