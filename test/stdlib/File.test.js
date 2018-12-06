const { ListDir, ReadAsciiFile, WriteAsciiFile, getMemfsPath, getVolumeByPath } = require("../../lib/stdlib/index");
const { Interpreter } = require("../../lib/interpreter");
const { BrsTypes } = require("brs");
const { BrsString } = BrsTypes;

let interpreter;

describe("global file I/O functions", () => {
    beforeEach(() => {
        interpreter = new Interpreter(); // reset the file systems
    });

    describe("file I/O utility utilities", () => {
        it("gets a volume by path", () => {
            expect(getVolumeByPath(interpreter, "tmp:///test.txt")).toEqual(interpreter.temporaryVolume);
        });

        it("converts a brs path to a memfs path", () => {
            expect(getMemfsPath("tmp:/test.txt")).toEqual("/test.txt");
            expect(getMemfsPath("tmp:///test.txt")).toEqual("/test.txt");
        })
    });

    describe("ListDir", () => {
        it("returns files in a directory", () => {
            interpreter.temporaryVolume.writeFileSync("/test1.txt", "test contents 1");
            interpreter.temporaryVolume.writeFileSync("/test2.txt", "test contents 2");
            interpreter.temporaryVolume.mkdirpSync("/test_dir");
            interpreter.temporaryVolume.writeFileSync("/test_dir/test3.txt", "test contents 3");

            expect(
                ListDir.call(interpreter, new BrsString("tmp:///")).elements
            ).toEqual([ "test1.txt", "test2.txt", "test_dir" ]);
        });

        it("returns nothing on a bad path", () => {
            expect(
                ListDir.call(interpreter, new BrsString("tmp:///ack")).elements
            ).toEqual([]);
        });
    });

    describe("ReadAsciiFile", () => {
        it("reads an ascii file", () => {
            interpreter.temporaryVolume.writeFileSync("/test.txt", "test contents");
            
            expect(
                ReadAsciiFile.call(interpreter, new BrsString("tmp:///test.txt")).value
            ).toEqual("test contents");

            expect(
                ReadAsciiFile.call(interpreter, new BrsString("tmp:/test.txt")).value
            ).toEqual("test contents");
        });
    });

    describe("WriteAsciiFile", () => {
        it("fails writing to bad paths", () => {
            expect(
                WriteAsciiFile.call(interpreter, new BrsString("hello.txt"), new BrsString("test contents")).value
            ).toBeFalsy();
        });

        it("writes an ascii file", () => {
            expect(
                WriteAsciiFile.call(interpreter, new BrsString("tmp:///hello.txt"), new BrsString("test contents")).value
            ).toBeTruthy();

            expect(interpreter.temporaryVolume.readFileSync("/hello.txt").toString()).toEqual("test contents");
        });
    });
});
