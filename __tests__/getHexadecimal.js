const { getHexadecimal } = require("../src/getHexadecimal");

describe("getHexadecimal", () => {
    test("returns a literal if two hex values not provided", () => {
        expect(getHexadecimal("\\xb", 2)).toEqual({
            nextIndex: 3,
            token: {
                quantifier: "exactlyOne",
                regex: "\\x",
                type: "literal",
                value: "x"
            }
        });
    });
    test("returns the correct value for a valid hexadecimal", () => {
        expect(getHexadecimal("ol\\x41", 4)).toEqual({
            nextIndex: 6,
            token: {
                quantifier: "exactlyOne",
                regex: "\\x41",
                type: "hexadecimal",
                value: "A"
            }
        });
    });
    test("should handle if invalid value provided", () => {
        expect(getHexadecimal("\\xgg", 2)).toEqual({
            nextIndex: 3,
            token: {
                quantifier: "exactlyOne",
                regex: "\\x",
                type: "literal",
                value: "x"
            }
        });
    });
});
