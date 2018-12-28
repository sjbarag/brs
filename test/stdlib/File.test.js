const { ListDir, CopyFile, MoveFile, DeleteFile, DeleteDirectory, CreateDirectory, FormatDrive, ReadAsciiFile, WriteAsciiFile, getMemfsPath, getVolumeByPath } = require("@lib/stdlib");
const { Interpreter } = require("@lib/interpreter");
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
        it("returns files in a directory", async () => {
            interpreter.temporaryVolume.writeFileSync("/test1.txt", "test contents 1");
            interpreter.temporaryVolume.writeFileSync("/test2.txt", "test contents 2");
            interpreter.temporaryVolume.mkdirpSync("/test_dir");
            interpreter.temporaryVolume.writeFileSync("/test_dir/test3.txt", "test contents 3");

            expect(
                (await ListDir.call(interpreter, new BrsString("tmp:///"))).elements
            ).toEqual([ new BrsString("test1.txt"), new BrsString("test2.txt"), new BrsString("test_dir") ]);
        });

        it("returns nothing on a bad path", async () => {
            expect(
                (await ListDir.call(interpreter, new BrsString("tmp:///ack"))).elements
            ).toEqual([]);
        });
    });

    describe("CopyFile", () => {
        it("copies a file", async () => {
            interpreter.temporaryVolume.writeFileSync("/test1.txt", "test contents 1");

            expect(
                (await CopyFile.call(interpreter, new BrsString("tmp:///test1.txt"), new BrsString("tmp:///test1.1.txt"))).value
            ).toBeTruthy();
            expect(interpreter.temporaryVolume.existsSync("/test1.txt")).toBeTruthy();
            expect(interpreter.temporaryVolume.existsSync("/test1.1.txt")).toBeTruthy();
        });

        it("fails with a false", async () => {
            expect(
                (await CopyFile.call(interpreter, new BrsString("tmp:///test1.txt"), new BrsString("ack:///test1.txt"))).value
            ).toBeFalsy();

            expect(
                (await CopyFile.call(interpreter, new BrsString("tmp:///no_such_file.txt"), new BrsString("tmp:///test1.txt"))).value
            ).toBeFalsy();
        });
    });

    describe("MoveFile", () => {
        it("moves a file", async () => {
            interpreter.temporaryVolume.writeFileSync("/test1.txt", "test contents 1");

            expect(
                (await MoveFile.call(interpreter, new BrsString("tmp:///test1.txt"), new BrsString("tmp:///test5.txt"))).value
            ).toBeTruthy();
            expect(interpreter.temporaryVolume.existsSync("/test1.txt")).toBeFalsy();
            expect(interpreter.temporaryVolume.existsSync("/test5.txt")).toBeTruthy();
        });

        it("fails with a false", async () => {
            expect(
                (await MoveFile.call(interpreter, new BrsString("tmp:///test1.txt"), new BrsString("ack:///test1.txt"))).value
            ).toBeFalsy();

            expect(
                (await MoveFile.call(interpreter, new BrsString("tmp:///no_such_file.txt"), new BrsString("tmp:///test1.txt"))).value
            ).toBeFalsy();
        });
    });

    describe("DeleteFile", () => {
        it("deletes a file", async () => {
            interpreter.temporaryVolume.writeFileSync("/test1.txt", "test contents 1");

            expect(
                (await DeleteFile.call(interpreter, new BrsString("tmp:///test1.txt"))).value
            ).toBeTruthy();
            expect(interpreter.temporaryVolume.existsSync("/test1.txt")).toBeFalsy();
        });

        it("fails with a false", async () => {
            expect(
                (await DeleteFile.call(interpreter, new BrsString("tmp:///test1.txt"))).value
            ).toBeFalsy();
        });
    });

    describe("DeleteDirectory", () => {
        it("deletes a directory", async () => {
            interpreter.temporaryVolume.mkdirSync("/test_dir");

            expect(
                (await DeleteDirectory.call(interpreter, new BrsString("tmp:///test_dir"))).value
            ).toBeTruthy();
            expect(interpreter.temporaryVolume.existsSync("/test_dir")).toBeFalsy();
        });

        it("fails with a false", async () => {
            interpreter.temporaryVolume.mkdirSync("/test_dir");
            interpreter.temporaryVolume.writeFileSync("/test_dir/test1.txt", "test contents 1");

            // can't remove a non-empty directory
            expect(
                (await DeleteDirectory.call(interpreter, new BrsString("tmp:///test_dir/test1.txt"))).value
            ).toBeFalsy();
        });
    });

    describe("CreateDirectory", () => {
        it("creates a directory", async () => {
            expect(
                (await CreateDirectory.call(interpreter, new BrsString("tmp:///test_dir"))).value
            ).toBeTruthy();
            expect(interpreter.temporaryVolume.existsSync("/test_dir")).toBeTruthy();

            expect(
                (await CreateDirectory.call(interpreter, new BrsString("tmp:///test_dir/test_sub_dir"))).value
            ).toBeTruthy();
            expect(interpreter.temporaryVolume.existsSync("/test_dir/test_sub_dir")).toBeTruthy();
        });

        it("fails with a false", async () => {
            interpreter.temporaryVolume.mkdirSync("/test_dir");

            // can't recreate a directory
            expect(
                (await CreateDirectory.call(interpreter, new BrsString("tmp:///test_dir"))).value
            ).toBeFalsy();
        });
    });

    describe("FormatDrive", () => {
        it("fails", async () => {
            expect(
                (await FormatDrive.call(interpreter, new BrsString("foo"), new BrsString("bar"))).value
            ).toBeFalsy();
        });
    });

    describe("ReadAsciiFile", () => {
        it("reads an ascii file", async () => {
            interpreter.temporaryVolume.writeFileSync("/test.txt", "test contents");

            expect(
                (await ReadAsciiFile.call(interpreter, new BrsString("tmp:///test.txt"))).value
            ).toEqual("test contents");

            expect(
                (await ReadAsciiFile.call(interpreter, new BrsString("tmp:/test.txt"))).value
            ).toEqual("test contents");
        });
    });

    describe("WriteAsciiFile", () => {
        it("fails writing to bad paths", async () => {
            expect(
                (await WriteAsciiFile.call(interpreter, new BrsString("hello.txt"), new BrsString("test contents"))).value
            ).toBeFalsy();
        });

        it("writes an ascii file", async () => {
            expect(
                (await WriteAsciiFile.call(interpreter, new BrsString("tmp:///hello.txt"), new BrsString("test contents"))).value
            ).toBeTruthy();

            expect(interpreter.temporaryVolume.readFileSync("/hello.txt").toString()).toEqual("test contents");
        });
    });
});
