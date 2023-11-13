const { getPatternAndFlags } = require("../src/index");
const { handleEscapes } = require("../src/handleEscapes.js");

describe("handleEscapes", () => {
    it("should handle backspace", () => {
        const testRegex = /[\b]/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[2];
        const nextChar = pattern[3];
        const index = 2;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: true,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "[\\b]",
                type: "controlCharacter",
                value: "backspace",
            },
        });
    });
    it("should handle wordBoundary", () => {
        const testRegex = /\b/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\b",
                type: "assertion",
                value: "wordBoundary",
            },
        });
    });
    it("should handle nonWordBoundary", () => {
        const testRegex = /\B/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\B",
                type: "assertion",
                value: "nonWordBoundary",
            },
        });
    });
    it("should handle \\B in a character set", () => {
        // eslint-disable-next-line no-useless-escape
        const testRegex = /[\B]/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[2];
        const nextChar = pattern[3];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: true,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\B",
                type: "literal",
                value: "B",
            },
        });
    });
    it("should handle digit", () => {
        const testRegex = /\d/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\d",
                type: "characterClass",
                value: "digit",
            },
        });
    });
    it("should handle nonDigit", () => {
        const testRegex = /\D/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\D",
                type: "characterClass",
                value: "nonDigit",
            },
        });
    });
    it("should handle word", () => {
        const testRegex = /\w/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\w",
                type: "characterClass",
                value: "word",
            },
        });
    });
    it("should handle nonWord", () => {
        const testRegex = /\W/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\W",
                type: "characterClass",
                value: "nonWord",
            },
        });
    });
    it("should handle whiteSpace", () => {
        const testRegex = /\s/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\s",
                type: "characterClass",
                value: "whiteSpace",
            },
        });
    });
    it("should handle nonWhiteSpace", () => {
        const testRegex = /\S/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\S",
                type: "characterClass",
                value: "nonWhiteSpace",
            },
        });
    });
    it("should handle horizontalTab", () => {
        const testRegex = /\t/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\t",
                type: "characterClass",
                value: "horizontalTab",
            },
        });
    });
    it("should handle carriageReturn", () => {
        const testRegex = /\r/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\r",
                type: "characterClass",
                value: "carriageReturn",
            },
        });
    });
    it("should handle linefeed", () => {
        const testRegex = /\n/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: true,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\n",
                type: "characterClass",
                value: "linefeed",
            },
        });
    });
    it("should handle verticalTab", () => {
        const testRegex = /\v/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: true,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\v",
                type: "characterClass",
                value: "verticalTab",
            },
        });
    });
    it("should handle formFeed", () => {
        const testRegex = /\f/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: true,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\f",
                type: "characterClass",
                value: "formFeed",
            },
        });
    });
    it("should handle nulCharacter", () => {
        const testRegex = /\0/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: true,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\0",
                type: "characterClass",
                value: "nulCharacter",
            },
        });
    });
    it("should handle control characters", () => {
        const testRegex = /\cA/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 2,
            token: {
                quantifier: "exactlyOne",
                regex: "\\cA",
                type: "controlCharacter",
                value: "startOfHeading",
            },
        });
    });
    it("should handle unicode", () => {
        const testRegex = /\u{12352}/gsu;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 8,
            token: {
                quantifier: "exactlyOne",
                regex: "\\u{12352}",
                type: "unicodeExtended",
                value: "𒍒",
            },
        });
    });
    it("should handle a hexadecimal value", () => {
        const testRegex = /\x4a/gs;
        const { pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode: false
            })).toEqual({
                index: index + 3,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\x4a",
                    type: "hexadecimal",
                    value: "J"
                }
            });
    });
    describe("named backreference", () => {
        it("should handle if there is no named capture group of that name", () => {
            const testRegex = /\k<quote>/gs;
            const { pattern } = getPatternAndFlags(testRegex);
            const index = 1;
            const currentChar = pattern[index];
            const nextChar = pattern[index + 1];
            const captureList = [];
            const namedCaptures = {};
            expect(
                handleEscapes({
                    captureList,
                    currentChar,
                    inCharacterSet: false,
                    index,
                    namedCaptures,
                    nextChar,
                    pattern,
                    unicodeMode: false,
                })
            ).toEqual({
                index: index + 1,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\k",
                    type: "literal",
                    value: "k"
                }
            });
        });
        it("should handle if there is a named capture group of that name", () => {
            const testRegex = /(?<quote>['"]).*\k<quote>/;
            const { pattern } = getPatternAndFlags(testRegex);
            const index = 17;
            const currentChar = pattern[index];
            const nextChar = pattern[index + 1];
            const capture = {
                quantifier: "exactlyOne",
                regex: "(?<quote>['\"])",
                type: "namedCapturingGroup",
                value: [
                    {
                        quantifier: "exactlyOne",
                        regex: "['\"]",
                        type: "characterSet",
                        value: [
                            {
                                quantifier: "exactlyOne",
                                regex: "'",
                                type: "literal",
                                value: "'",
                            },
                            {
                                quantifier: "exactlyOne",
                                regex: "\"",
                                type: "literal",
                                value: "\"",
                            }
                        ]
                    }
                ]
            };
            const captureList = [capture];
            const namedCaptures = {quote: capture};
            // tokenize(pattern);
            expect(handleEscapes({
                captureList,
                currentChar,
                inCharacterSet: false,
                index,
                namedCaptures,
                nextChar,
                pattern,
                unicodeMode: false,
            })).toEqual({
                index: pattern.length,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\k<quote>",
                    type: "namedBackreference",
                    value: namedCaptures["quote"]
                }
            });
        });
        it("should treat an escaped k as a literal if not followed by a <", () => {
            const testRegex = /(['"]).*\k/;
            const { pattern } = getPatternAndFlags(testRegex);
            const index = 9;
            const currentChar = pattern[index];
            const nextChar = pattern[index + 1];
            const capture = {
                quantifier: "exactlyOne",
                regex: "(?<quote>['\"])",
                type: "capturingGroup",
                value: [
                    {
                        quantifier: "exactlyOne",
                        regex: "['\"]",
                        type: "characterSet",
                        value: [
                            {
                                quantifier: "exactlyOne",
                                regex: "'",
                                type: "literal",
                                value: "'",
                            },
                            {
                                quantifier: "exactlyOne",
                                regex: "\"",
                                type: "literal",
                                value: "\"",
                            }
                        ]
                    }
                ]
            };
            const captureList = [capture];
            const namedCaptures = {};
            // tokenize(pattern);
            expect(handleEscapes({
                captureList,
                currentChar,
                inCharacterSet: false,
                index,
                namedCaptures,
                nextChar,
                pattern,
                unicodeMode: false,
            })).toEqual({
                index: index + 1,
                token: {
                    quantifier: "exactlyOne",
                    regex: "\\k",
                    type: "literal",
                    value: "k"
                }
            });
        });
    });
    it("should treat everything else as an escaped character", () => {
        // eslint-disable-next-line no-useless-escape
        const testRegex = /\z/gs;
        const { flags, pattern } = getPatternAndFlags(testRegex);
        const currentChar = pattern[1];
        const nextChar = pattern[2];
        const index = 1;
        const unicodeMode = flags.includes("u");
        expect(
            handleEscapes({
                currentChar,
                inCharacterSet: false,
                index,
                nextChar,
                pattern,
                unicodeMode,
            })
        ).toEqual({
            index: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: `\\${pattern[index]}`,
                type: "element",
                value: pattern[index],
            },
        });
    });
});
