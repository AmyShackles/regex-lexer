const { handleEscapedNumber } = require("../src/handleEscapedNumber.js");
const { getParenStack} = require("../src/getParenStack.js");
const { getPatternAndFlags } = require("../src/index.js");

describe("handleEscapedNumber", () => {
    it("should handle nul characters", () => {
        const testRegex = /\0/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const captureRegex = /^(?<capture_group>(?:(?<named_capture>\(\?<.*?>.*?\))|(?<capture>\([^?][^:]?.*?\))))$/;
        const captureList = getParenStack(pattern).filter((group) => captureRegex.test(group));
        const numberOfBackreferences = captureList.length;
        expect(handleEscapedNumber(captureList, numberOfBackreferences, pattern, 1, flags.includes("u"))).toEqual({
            nextIndex: 2,
            token: { 
                quantifier: "exactlyOne",
                regex: "\\0",
                type: "characterClass",
                value: "nulCharacter",
            }
        });
    });
    it("should handle backreferences", () => {
        const testRegex = /(Do)\1/;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const captureRegex = /^(?<capture_group>(?:(?<named_capture>\(\?<.*?>.*?\))|(?<capture>\([^?][^:]?.*?\))))$/;
        const captureList = getParenStack(pattern).filter((group) => captureRegex.test(group));
        const numberOfBackreferences = captureList.length;
        expect(handleEscapedNumber(captureList, numberOfBackreferences, pattern, 5, flags.includes("u"))).toEqual({
            nextIndex: 6,
            token: {
                quantifier: "exactlyOne",
                regex: "\\1",
                type: "backreference",
                value: `repeat capture of ${captureList[0]}`
            }
        });
    });
    it("should throw an error in unicode mode", () => {
        const testRegex = /\1/;
        const pattern = testRegex.toString();
        const captureRegex = /^(?<capture_group>(?:(?<named_capture>\(\?<.*?>.*?\))|(?<capture>\([^?][^:]?.*?\))))$/;
        const captureList = getParenStack(pattern).filter((group) => captureRegex.test(group));
        const numberOfBackreferences = captureList.length;
        function testError() {
            handleEscapedNumber(captureList, numberOfBackreferences, pattern, 1, true);
        }
        expect(testError).toThrowError(new Error("Octal escapes are not valid in unicode mode"));
    });
    it("should handle control character octals", () => {
        const testRegex = /\12/;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const captureRegex = /^(?<capture_group>(?:(?<named_capture>\(\?<.*?>.*?\))|(?<capture>\([^?][^:]?.*?\))))$/;
        const captureList = getParenStack(pattern).filter((group) => captureRegex.test(group));
        const numberOfBackreferences = captureList.length;
        expect(handleEscapedNumber(captureList, numberOfBackreferences, pattern, 1, flags.includes("u"))).toEqual({
            nextIndex: 3,
            token: {
                quantifier: "exactlyOne",
                regex: "\\12",
                type: "controlCharacter",
                value: "lineFeed"
            }
        });
        expect(handleEscapedNumber([], 0, "\\7", 1, false)).toEqual({
            nextIndex: 2,
            token: {
                quantifier: "exactlyOne",
                regex: "\\7",
                type: "controlCharacter",
                value: "bell"
            }
        });
        expect(handleEscapedNumber([], 0, "\\4", 1, false)).toEqual({
            nextIndex: 2,
            token: {
                quantifier: "exactlyOne",
                regex: "\\4",
                type: "controlCharacter",
                value: "endOfTransmit"
            }
        });
    });
    it("should handle non-octals", () => {
        const testRegex = /\88/;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const captureRegex = /^(?<capture_group>(?:(?<named_capture>\(\?<.*?>.*?\))|(?<capture>\([^?][^:]?.*?\))))$/;
        const captureList = getParenStack(pattern).filter((group) => captureRegex.test(group));
        const numberOfBackreferences = captureList.length;
        expect(handleEscapedNumber(captureList, numberOfBackreferences, pattern, 1, flags.includes("u"))).toEqual({
            nextIndex: 2,
            token: {
                quantifier: "exactlyOne",
                regex: "\\8",
                type: "literal",
                value: "8"
            }
        });
    });
    it("should handle two-digit octals", () => {
        const testRegex = /\77/;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const captureRegex = /^(?<capture_group>(?:(?<named_capture>\(\?<.*?>.*?\))|(?<capture>\([^?][^:]?.*?\))))$/;
        const captureList = getParenStack(pattern).filter((group) => captureRegex.test(group));
        const numberOfBackreferences = captureList.length;
        expect(handleEscapedNumber(captureList, numberOfBackreferences, pattern, 1, flags.includes("u"))).toEqual({
            nextIndex: 3,
            token: {
                quantifier: "exactlyOne",
                regex: "\\77",
                type: "octal",
                value: "?"
            }
        });
        expect(handleEscapedNumber([], 0, "\\27", 1, flags.includes("u"))).toEqual({
            nextIndex: 3,
            token: {
                quantifier: "exactlyOne",
                regex: "\\27",
                type: "controlCharacter",
                value: "endOfTransmitBlock"
            }
        });
    });
    it("should handle three-digit octals", () => {
        const testRegex = /\377/;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const captureRegex = /^(?<capture_group>(?:(?<named_capture>\(\?<.*?>.*?\))|(?<capture>\([^?][^:]?.*?\))))$/;
        const captureList = getParenStack(pattern).filter((group) => captureRegex.test(group));
        const numberOfBackreferences = captureList.length;
        expect(handleEscapedNumber(captureList, numberOfBackreferences, pattern, 1, flags.includes("u"))).toEqual({
            nextIndex: 4,
            token: {
                quantifier: "exactlyOne",
                regex: "\\377",
                type: "octal",
                value: "ÿ"
            }
        });
        expect(handleEscapedNumber([], 0, "\\376", 1, false)).toEqual({
            nextIndex: 4,
            token: {
                quantifier: "exactlyOne",
                regex: "\\376",
                type: "octal",
                value: "þ"
            }
        });
    });
});
