const { getUnicode } = require("../src/getUnicode.js");

const unicodeChar = "Ӹ";

describe("getUnicode", () => {
    describe("unicode flag set", () => {
        test("should return the correct token if extended unicode passed in", () => {
            expect(getUnicode("{12352}", 0, true)).toEqual({
                nextIndex: 7,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\u{12352}",
                    type: "unicodeExtended",
                    value: "𒍒",
                }
            });
            expect(getUnicode("what\\u{04F8}abracadabra", 6, true)).toEqual({
                nextIndex: 12,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\u{04F8}",
                    type: "unicodeExtended",
                    value: unicodeChar,
                }
            });
        });
        test("should return the correct token if unicode passed in", () => {
            expect(getUnicode("1234a", 0, true)).toEqual({
                nextIndex: 4,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\u1234",
                    type: "unicode",
                    value: "ሴ"
                }
            });
        });
        test("should return a literal if an invalid unicode is passed in", () => {
            expect(getUnicode("12", 0, true)).toEqual({
                nextIndex: 1,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\u",
                    type: "literal",
                    value: "u",
                }
            }
        );
        });
    });
    describe("unicode flag not set", () => {
        test("should throw error if extended unicode is used outside of unicode mode", () => {
            expect(() => {
                getUnicode("{12345}", 0, false);
            }).toThrowError("Invalid use of extended unicode outside of unicode mode");
        });
    });
});
