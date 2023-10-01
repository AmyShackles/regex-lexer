const { getUnicode } = require("../src/getUnicode.js");

const unicodeChar = "Ӹ";

describe("getUnicode", () => {
    describe("unicode flag set", () => {
        test("should return the correct token if extended unicode passed in", () => {
            expect(getUnicode("\\u{12352}", 2, true)).toEqual({
                nextIndex: 9,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\u{12352}",
                    type: "unicodeExtended",
                    value: "𒍒",
                },
            });
            expect(getUnicode("what\\u{04F8}abracadabra", 6, true)).toEqual({
                nextIndex: 12,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\u{04F8}",
                    type: "unicodeExtended",
                    value: unicodeChar,
                },
            });
        });
        test("should return the correct token if unicode passed in", () => {
            expect(getUnicode("\\u1234a", 2, true)).toEqual({
                nextIndex: 6,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\u1234",
                    type: "unicode",
                    value: "ሴ",
                },
            });
        });
        test("should return a literal if an invalid unicode is passed in", () => {
            expect(getUnicode("\\u12", 2, true)).toEqual({
                nextIndex: 3,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\u",
                    type: "literal",
                    value: "u",
                },
            });
        });
    });
    describe("unicode flag not set", () => {
        test("should treat number in brackets as quantifier", () => {
            expect(getUnicode("\\u{12345}", 2, false)).toEqual({
                nextIndex: 9,
                token: {
                    quantifier: "exactly 12345 times",
                    regex: "\\u{12345}",
                    type: "literal",
                    value: "\"u\" repeated exactly 12345 times",
                },
            });
            expect(getUnicode("\\u{12}", 2, false)).toEqual({
                nextIndex: 6,
                token: {
                    quantifier: "exactly 12 times",
                    regex: "\\u{12}",
                    type: "literal",
                    value: "\"u\" repeated exactly 12 times",
                }
            });
        });
        test("should return just the u if non-number in brackets", () => {
            expect(getUnicode("\\u{a}", 2, false)).toEqual({
                nextIndex: 3,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\u",
                    type: "literal",
                    value: "u"
                }
            });
        });
    });
});
