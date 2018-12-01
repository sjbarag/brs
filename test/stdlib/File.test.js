const { ReadAsciiFile, WriteAsciiFile, parseVolumeName, getVolumeByPath } = require("../../lib/stdlib/index");
const { Interpreter } = require("../../lib/interpreter");
const { BrsTypes } = require("brs");
const { BrsString } = BrsTypes;

const interpreter = new Interpreter();

describe("global file I/O functions", () => {
    describe("file I/O utility utilities", () => {
        it("gets a volume name", () => {
            expect(parseVolumeName("tmp:///test.txt")).toEqual("tmp");
            expect(parseVolumeName("/tmp:///")).toEqual("");
        });

        it("gets a volume by path", () => {
            expect(getVolumeByPath(interpreter, "tmp:///test.txt")).toEqual(interpreter.temporaryVolume);
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

    describe.skip("WriteAsciiFile", () => {
        it("fails writing to bad paths", () => {
            expect(
                WriteAsciiFile.call(interpreter, new BrsString("hello.text"), new BrsString("test contents")).value
            ).toBeFalsy();
        });

        it("writes an ascii file", () => {
            expect(
                WriteAsciiFile.call(interpreter, new BrsString("tmp:///hello.text"), new BrsString("test contents")).value
            ).toBeTruthy();

            expect(interpreter.temporaryVolume.toJSON()).toEqual({ "/hello.txt": "test contents" });
        });
    });
});