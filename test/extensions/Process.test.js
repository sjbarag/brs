const brs = require("../../lib");
const { BrsString } = brs.types;
const { Process: brsProcess } = require("../../lib/extensions/Process");

describe("_brs_.process", () => {
    it("mirrors node's process.argv", () => {
        let brsArgv = brsProcess.get(new BrsString("argv"));
        expect(brsArgv).toBeDefined();
        expect(brsArgv.getValue().map((arg) => arg.value)).toEqual(process.argv);
    });
});
