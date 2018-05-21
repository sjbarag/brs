export class OutputProxy {
    currentLineLength = 0;

    constructor(private outputStream: NodeJS.WriteStream) { }

    write(str: string) {
        this.outputStream.write(str);

        let lines = str.split("\n");

        if (lines.length > 1) {
            // the length of the most recent line is now the current line length
            this.currentLineLength = lines[lines.length - 1].length;
            return;
        }

        // but if this wasn't a multi-line string, we're just appending to the current line
        this.currentLineLength += str.length; 
    }

    position() {
        if (!this.outputStream.isTTY || !this.outputStream.columns) {
            return this.currentLineLength;
        }

        return this.currentLineLength % this.outputStream.columns;
    }
}