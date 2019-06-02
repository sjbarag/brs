const brs = require("brs");
const { Int32, BrsString, RoString, BrsBoolean, Callable } = brs.types;
const { Interpreter } = require("../../../lib/interpreter");

describe("RoString", () => {
    describe("equality", () => {
        it("compares to intrinsic strings", () => {
            let a = new RoString(new BrsString("foo"));
            let b = new BrsString("foo");
            let c = new BrsString("bar");

            expect(a.equalTo(b)).toBe(BrsBoolean.True);
            expect(a.equalTo(c)).toBe(BrsBoolean.False);
        });

        it("compares to boxed strings", () => {
            let a = new RoString(new BrsString("foo"));
            let b = new RoString(new BrsString("foo"));
            let c = new RoString(new BrsString("bar"));

            expect(a.equalTo(b)).toBe(BrsBoolean.True);
            expect(a.equalTo(c)).toBe(BrsBoolean.False);
        });
    });

    test("toString", () => {
        expect(new RoString(new BrsString("A1b2C#☃︎")).toString()).toBe("A1b2C#☃︎");
    });

    describe("ifStringOps", () => {
        let interpreter;

        beforeEach(() => {
            interpreter = new Interpreter();
        });

        describe("setString", () => {
            let s, setString;

            beforeEach(() => {
                s = new RoString(new BrsString("before"));
                setString = s.getMethod("setString");
                expect(setString).toBeInstanceOf(Callable);
            });

            it("overwrites its stored string", () => {
                setString.call(interpreter, new BrsString("after"), new Int32(2));
                expect(s.intrinsic).toEqual(new BrsString("af"));
            });

            it("overwrites an empty string for zero `len`", () => {
                setString.call(interpreter, new BrsString("after"), new Int32(0));
                expect(s.intrinsic).toEqual(new BrsString(""));
            });

            it("overwrites an empty string for negative `len`", () => {
                setString.call(interpreter, new BrsString("after"), new Int32(-1));
                expect(s.intrinsic).toEqual(new BrsString(""));
            });
        });

        describe("appendString", () => {
            let s, appendString;

            beforeEach(() => {
                s = new RoString(new BrsString("before"));
                appendString = s.getMethod("appendString");
                expect(appendString).toBeInstanceOf(Callable);
            });

            it("appends positive `len` characters", () => {
                appendString.call(interpreter, new BrsString("after"), new Int32(3));
                expect(s.intrinsic).toEqual(new BrsString("beforeaft"));
            });

            it("appends nothing for zero `len`", () => {
                appendString.call(interpreter, new BrsString("after"), new Int32(0));
                expect(s.intrinsic).toEqual(new BrsString("before"));
            });

            it("appends nothing for negative `len`", () => {
                appendString.call(interpreter, new BrsString("after"), new Int32(-1));
                expect(s.intrinsic).toEqual(new BrsString("before"));
            });
        });

        describe("len", () => {
            it("returns the length of the intrinsic string", () => {
                let s = new RoString(new BrsString("☃☃☃"));
                let len = s.getMethod("len");
                expect(len).toBeInstanceOf(Callable);
                expect(len.call(interpreter)).toEqual(new Int32(3));
            });
        });

        describe("left", () => {
            let s, left;

            beforeEach(() => {
                s = new RoString(new BrsString("☃ab"));
                left = s.getMethod("left");
                expect(left).toBeInstanceOf(Callable);
            });

            it("returns the entire string for `len` greater than string length", () => {
                expect(left.call(interpreter, new Int32(500))).toEqual(new BrsString("☃ab"));
            });

            it("returns the first `len` characters for positive `len`", () => {
                expect(left.call(interpreter, new Int32(2))).toEqual(new BrsString("☃a"));
            });

            it("returns an empty string for non-positive `len`", () => {
                expect(left.call(interpreter, new Int32(0))).toEqual(new BrsString(""));
                expect(left.call(interpreter, new Int32(-25))).toEqual(new BrsString(""));
            });
        });

        describe("right", () => {
            let s, right;

            beforeEach(() => {
                s = new RoString(new BrsString("☃ab"));
                right = s.getMethod("right");
                expect(right).toBeInstanceOf(Callable);
            });

            it("returns the entire string for `len` greater than string length", () => {
                expect(right.call(interpreter, new Int32(500))).toEqual(new BrsString("☃ab"));
            });

            it("returns the last `len` characters for positive `len`", () => {
                expect(right.call(interpreter, new Int32(2))).toEqual(new BrsString("ab"));
            });

            it("returns an empty string for non-positive `len`", () => {
                expect(right.call(interpreter, new Int32(0))).toEqual(new BrsString(""));
                expect(right.call(interpreter, new Int32(-25))).toEqual(new BrsString(""));
            });
        });

        describe("mid", () => {
            let s, mid;

            beforeEach(() => {
                //                              0   0   0   1   1   2   2
                //                              0   4   8   2   6   0   4
                s = new RoString(new BrsString("Lorem ipsum dolor sit aMeT"));
                mid = s.getMethod("mid");
                expect(mid).toBeInstanceOf(Callable);
            });

            describe("without `len`", () => {
                it("returns all characters after positive `start_point`", () => {
                    expect(mid.call(interpreter, new Int32(12))).toEqual(
                        new BrsString("dolor sit aMeT")
                    );
                });

                it("returns entire string for zero `start_point`", () => {
                    expect(mid.call(interpreter, new Int32(0))).toEqual(
                        new BrsString("Lorem ipsum dolor sit aMeT")
                    );
                });

                it("returns entire string for negative `start_point`", () => {
                    expect(mid.call(interpreter, new Int32(-30))).toEqual(
                        new BrsString("Lorem ipsum dolor sit aMeT")
                    );
                });

                it("returns empty string for `start_point` greater than string length", () => {
                    expect(mid.call(interpreter, new Int32(26))).toEqual(new BrsString(""));
                });
            });

            describe("with `len`", () => {
                it("returns `len` characters after positive `start_point`", () => {
                    expect(mid.call(interpreter, new Int32(12), new Int32(7))).toEqual(
                        new BrsString("dolor s")
                    );
                });

                it("returns string starting at 0 for negative `start_point` and positive `len`", () => {
                    expect(mid.call(interpreter, new Int32(-30), new Int32(7))).toEqual(
                        new BrsString("Lorem i")
                    );
                });

                it("returns empty string for negative `start_point` and negative `len`", () => {
                    expect(mid.call(interpreter, new Int32(-30), new Int32(-9))).toEqual(
                        new BrsString("")
                    );
                });

                it("returns empty string for `start_point` greater than string length", () => {
                    expect(mid.call(interpreter, new Int32(26), new Int32(5))).toEqual(
                        new BrsString("")
                    );
                });
            });
        });

        describe("instr", () => {
            let s, instr;

            beforeEach(() => {
                //                              0   0   0   1   1   2   2
                //                              0   4   8   2   6   0   4
                s = new RoString(new BrsString("Monday, Tuesday, Happy Days"));
                instr = s.getMethod("instr");
                expect(instr).toBeInstanceOf(Callable);
            });

            describe("without start_index", () => {
                it("returns the index of the first occurrence", () => {
                    expect(instr.call(interpreter, new BrsString("day"))).toEqual(new Int32(3));
                });

                it("returns -1 for not-found substrings", () => {
                    expect(instr.call(interpreter, new BrsString("Fonzie"))).toEqual(new Int32(-1));
                });

                it.todo("returns 0 for empty substrings");
                // TODO: compare to RBI
                // () => expect(instr.call(interpreter, new BrsString(""))).toEqual(new Int32(-1));
            });

            describe("with start_index", () => {
                it("returns the index of the first occurrence after `start_index`", () => {
                    expect(instr.call(interpreter, new Int32(5), new BrsString("day"))).toEqual(
                        new Int32(12)
                    );
                });

                it("returns -1 for not-found substrings", () => {
                    expect(instr.call(interpreter, new Int32(5), new BrsString("Monday"))).toEqual(
                        new Int32(-1)
                    );
                });

                it.todo("returns start_index for empty substrings");
                // TODO: compare to RBI
                // () => expect(instr.call(interpreter, new BrsString(""))).toEqual(new Int32(-1));
            });
        });

        describe("replace", () => {
            let s, replace;

            beforeEach(() => {
                s = new RoString(new BrsString("tossed salad and scrambled eggs"));
                replace = s.getMethod("replace");
                expect(replace).toBeInstanceOf(Callable);
            });

            it("replaces all instances of `from` with `to`", () => {
                expect(replace.call(interpreter, new BrsString("s"), new BrsString("$"))).toEqual(
                    new BrsString("to$$ed $alad and $crambled egg$")
                );
            });

            it("returns the original string for empty `from`", () => {
                expect(
                    replace.call(
                        interpreter,
                        new BrsString(""),
                        new BrsString("oh baby I hear the blues a-callin'")
                    )
                ).toEqual(new BrsString("tossed salad and scrambled eggs"));
            });
        });

        describe("trim", () => {
            let s, trim;
            beforeEach(() => {
                let whitespace = [
                    String.fromCharCode(0x0a), // newline
                    String.fromCharCode(0x0b), // vertical tab
                    String.fromCharCode(0x0c), // form feed
                    String.fromCharCode(0x0d), // carriage return
                    String.fromCharCode(0xa0), // non-breaking space
                    "\t", // just a regular tab
                    " ", // just a regular space
                ].join("");

                s = new RoString(new BrsString(whitespace + "hello" + whitespace));
                trim = s.getMethod("trim");
                expect(trim).toBeInstanceOf(Callable);
            });

            it("removes leading and trailing whitespace", () => {
                expect(trim.call(interpreter)).toEqual(new BrsString("hello"));
            });
        });
    });
});
