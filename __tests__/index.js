const {
    dotRegex,
    findInstancesInCharacterArray,
    getPatternAndFlags,
    tokenize,
} = require("../src/index.js");

const testRegex = /[a\bc](?<=a)\c23((a)\cA)+.*(?=5)[\b]/gs;
const regexString = testRegex.toString();

describe("findInstancesInCharacterArray", () => {
    test("should be able to find all instances of . in character sets", () => {
        expect(findInstancesInCharacterArray(dotRegex, regexString)).toEqual(
            [],
        );
    });
});
describe("getPatternsAndFlags", () => {
    describe("when regex is a RegExp", () => {
        test("should return the correct pattern", () => {
            const lastForwardSlash = regexString.lastIndexOf("/");
            expect(getPatternAndFlags(testRegex).pattern).toEqual(
                regexString.slice(1, lastForwardSlash),
            );
        });
        test("should return the correct flags", () => {
            expect(getPatternAndFlags(testRegex).flags).toEqual("gs");
        });
    });
    describe("when regex is a string", () => {
        describe("should return the correct pattern and flags", () => {
            test("when provided a regex string with pattern and flags", () => {
                const lastForwardSlash = regexString.lastIndexOf("/");
                expect(getPatternAndFlags(regexString).pattern).toEqual(
                    regexString.slice(1, lastForwardSlash),
                );
                expect(getPatternAndFlags(regexString).flags).toEqual("gs");
            });
            test("when provided a regex string without flags", () => {
                expect(getPatternAndFlags("/abcd/").pattern).toEqual("abcd");
                expect(getPatternAndFlags("/abcd/").flags).toEqual("");
            });
            test("when provided a regex string with a starting forward slash but not a second forward slash", () => {
                expect(getPatternAndFlags("/abc").pattern).toEqual("/abc");
                expect(getPatternAndFlags("/abc").flags).toEqual("");
            });
            test("when provided a regex string with values that aren't valid as flags", () => {
                expect(getPatternAndFlags("/abcd/agh").pattern).toEqual(
                    "/abcd/agh",
                );
                expect(getPatternAndFlags("/abcd/agh").flags).toEqual("");
            });
            test("when provided a string without a leading forward slash", () => {
                expect(getPatternAndFlags("abcd").pattern).toEqual("abcd");
                expect(getPatternAndFlags("abcd").flags).toEqual("");
            });
        });
    });
});
describe("tokenize", () => {
    test("should throw if there is a bad escape character", () => {
        expect(() => {
            tokenize("appple\\");
        }).toThrowError(
            "Invalid regular expression: /appple\\/: \\ at end of pattern",
        );
    });
    test("should throw if unescaped ) outside a character set that doesn't close a group", () => {
        expect(() => {
            tokenize("())");
        }).toThrow("Invalid regular expression: /())/: Unmatched ')'");
    });
    test("should return an array", () => {
        expect(Array.isArray(tokenize(testRegex))).toEqual(true);
    });
    test("should interpret ] as literal if not in a character set", () => {
        expect(tokenize("]")).toEqual([
            {
                quantifier: "exactlyOne",
                regex: "]",
                type: "literal",
                value: "]",
            },
        ]);
    });
    describe("should handle the difference in behavior in character sets", () => {
        test("should iinterpret a negative character set", () => {
            expect(tokenize("[^a]")).toEqual([
                {
                    quantifier: "exactlyOne",
                    regex: "[^a]",
                    type: "negativeCharacterSet",
                    value: [
                        {
                            quantifier: "exactlyOne",
                            regex: "a",
                            type: "literal",
                            value: "a",
                        },
                    ],
                },
            ]);
        });
        test("should interpret certain characters as literal in a character set", () => {
            expect(tokenize("[[$.|*+?(){}/]")).toEqual([
                {
                    quantifier: "exactlyOne",
                    regex: "[[$.|*+?(){}/]",
                    type: "characterSet",
                    value: [
                        {
                            quantifier: "exactlyOne",
                            regex: "[",
                            type: "literal",
                            value: "[",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "$",
                            type: "literal",
                            value: "$",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: ".",
                            type: "literal",
                            value: ".",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "|",
                            type: "literal",
                            value: "|",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "*",
                            type: "literal",
                            value: "*",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "+",
                            type: "literal",
                            value: "+",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "?",
                            type: "literal",
                            value: "?",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "(",
                            type: "literal",
                            value: "(",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: ")",
                            type: "literal",
                            value: ")",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "{",
                            type: "literal",
                            value: "{",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "}",
                            type: "literal",
                            value: "}",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "/",
                            type: "literal",
                            value: "/",
                        },
                    ],
                },
            ]);
        });
    });
    test("should handle alternation", () => {
        expect(tokenize("a|b")).toEqual([
            {
                quantifier: "exactlyOne",
                regex: "a",
                type: "literal",
                value: "a",
            },
            {
                quantifier: "exactlyOne",
                regex: "|",
                type: "alternation",
                value: " OR ",
            },
            {
                quantifier: "exactlyOne",
                regex: "b",
                type: "literal",
                value: "b",
            },
        ]);
    });
    describe("should handle -", () => {
        describe("inside character sets", () => {
            test("when character range is valid", () => {
                expect(tokenize("[a-z]")).toEqual([
                    {
                        quantifier: "exactlyOne",
                        regex: "[a-z]",
                        type: "characterSet",
                        value: [
                            {
                                quantifier: "exactlyOne",
                                regex: "a-z",
                                type: "literal",
                                value: "character between a and z",
                            },
                        ],
                    },
                ]);
            });
            test("when character range is not valid", () => {
                expect(() => {
                    tokenize("[z-a]");
                }).toThrowError(
                    "Invalid regular expression: /[z-a]/: Range out of order in character class",
                );
            });
        });
        test("outside character set", () => {
            expect(tokenize("a-z")).toEqual([
                {
                    quantifier: "exactlyOne",
                    regex: "a",
                    type: "literal",
                    value: "a",
                },
                {
                    quantifier: "exactlyOne",
                    regex: "-",
                    type: "literal",
                    value: "-",
                },
                {
                    quantifier: "exactlyOne",
                    regex: "z",
                    type: "literal",
                    value: "z",
                },
            ]);
        });
    });
    describe("should handle anchors", () => {
        describe("without multiline flag set", () => {
            test("starting anchor", () => {
                expect(tokenize(/^a/)).toEqual([
                    {
                        quantifier: "",
                        regex: "^",
                        type: "anchor",
                        value: "Match start of text",
                    },
                    {
                        quantifier: "exactlyOne",
                        regex: "a",
                        type: "literal",
                        value: "a",
                    },
                ]);
            });
            test("ending anchor", () => {
                expect(tokenize(/a$/)).toEqual([
                    {
                        quantifier: "exactlyOne",
                        regex: "a",
                        type: "literal",
                        value: "a",
                    },
                    {
                        quantifier: "",
                        regex: "$",
                        type: "anchor",
                        value: "Match end of text",
                    },
                ]);
            });
        });
        describe("with multiline flag set", () => {
            test("starting anchor", () => {
                expect(tokenize(/^a/m)).toEqual([
                    {
                        quantifier: "",
                        regex: "^",
                        type: "anchor",
                        value: "Match start of line",
                    },
                    {
                        quantifier: "exactlyOne",
                        regex: "a",
                        type: "literal",
                        value: "a",
                    },
                ]);
            });
            test("ending anchor", () => {
                expect(tokenize(/a$/m)).toEqual([
                    {
                        quantifier: "exactlyOne",
                        regex: "a",
                        type: "literal",
                        value: "a",
                    },
                    {
                        quantifier: "",
                        regex: "$",
                        type: "anchor",
                        value: "Match end of line",
                    },
                ]);
            });
        });
        test("should throw a warning if $ not escaped outside character set if not the last character", () => {
            expect(() => {
                tokenize(/$a/);
            }).toThrowError(
                "The '$' symbol means something special in regular expressions and so needs to be escaped outside of a character class if not used as an anchor",
            );
        });
    });
    describe("should handle (", () => {
        describe("should handle lookaheads", () => {
            test("positive lookahead", () => {
                expect(tokenize("a(?=b)")).toEqual([
                    {
                        quantifier: "exactlyOne",
                        regex: "a",
                        type: "literal",
                        value: "a",
                    },
                    {
                        quantifier: "exactlyOne",
                        regex: "(?=b)",
                        type: "positiveLookahead",
                        value: [
                            {
                                quantifier: "exactlyOne",
                                regex: "b",
                                type: "literal",
                                value: "b",
                            },
                        ],
                    },
                ]);
            });
            test("negative lookahead", () => {
                expect(tokenize("a(?!b)")).toEqual([
                    {
                        quantifier: "exactlyOne",
                        regex: "a",
                        type: "literal",
                        value: "a",
                    },
                    {
                        quantifier: "exactlyOne",
                        regex: "(?!b)",
                        type: "negativeLookahead",
                        value: [
                            {
                                quantifier: "exactlyOne",
                                regex: "b",
                                type: "literal",
                                value: "b",
                            },
                        ],
                    },
                ]);
            });
        });
        describe("should handle lookbehinds", () => {
            test("positive lookbehinds", () => {
                expect(tokenize("(?<=a)b")).toEqual([
                    {
                        quantifier: "exactlyOne",
                        regex: "(?<=a)",
                        type: "positiveLookbehind",
                        value: [
                            {
                                quantifier: "exactlyOne",
                                regex: "a",
                                type: "literal",
                                value: "a",
                            },
                        ],
                    },
                    {
                        quantifier: "exactlyOne",
                        regex: "b",
                        type: "literal",
                        value: "b",
                    },
                ]);
            });
            test("negative lookbehinds", () => {
                expect(tokenize("(?<!a)b")).toEqual([
                    {
                        quantifier: "exactlyOne",
                        regex: "(?<!a)",
                        type: "negativeLookbehind",
                        value: [
                            {
                                quantifier: "exactlyOne",
                                regex: "a",
                                type: "literal",
                                value: "a",
                            },
                        ],
                    },
                    {
                        quantifier: "exactlyOne",
                        regex: "b",
                        type: "literal",
                        value: "b",
                    },
                ]);
            });
            test("named capture groups", () => {
                expect(tokenize("(?<abc>1)")).toEqual([
                    {
                        quantifier: "exactlyOne",
                        regex: "(?<abc>1)",
                        type: "namedCapturingGroup",
                        value: [
                            {
                                quantifier: "exactlyOne",
                                regex: "1",
                                type: "literal",
                                value: "1",
                            },
                        ],
                    },
                ]);
            });
            test("should error if given (?< not followed by ! or = or capture group name", () => {
                expect(() => {
                    tokenize("(?<1)");
                }).toThrowError(
                    "Invalid regular expression: /(?<1)/: Invalid capture group name",
                );
            });
        });
        describe("should handle nonCapturing groups", () => {
            expect(tokenize("(?:a)b")).toEqual([
                {
                    quantifier: "exactlyOne",
                    regex: "(?:a)",
                    type: "nonCapturingGroup",
                    value: [
                        {
                            quantifier: "exactlyOne",
                            regex: "a",
                            type: "literal",
                            value: "a",
                        },
                    ],
                },
                {
                    quantifier: "exactlyOne",
                    regex: "b",
                    type: "literal",
                    value: "b",
                },
            ]);
        });
        describe("should handle capturing groups", () => {
            expect(tokenize("(abc)")).toEqual([
                {
                    quantifier: "exactlyOne",
                    regex: "(abc)",
                    type: "capturingGroup",
                    value: [
                        {
                            quantifier: "exactlyOne",
                            regex: "a",
                            type: "literal",
                            value: "a",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "b",
                            type: "literal",
                            value: "b",
                        },
                        {
                            quantifier: "exactlyOne",
                            regex: "c",
                            type: "literal",
                            value: "c",
                        },
                    ],
                },
            ]);
        });
    });
    describe("should handle /", () => {
        test("should throw if outside a character set and not escaped", () => {
            expect(() => {
                tokenize("/");
            }).toThrowError("Unescaped forward slash");
        });
        test("should return a literal in a character set", () => {
            expect(tokenize("[/]")).toEqual([
                {
                    quantifier: "exactlyOne",
                    regex: "[/]",
                    type: "characterSet",
                    value: [
                        {
                            quantifier: "exactlyOne",
                            regex: "/",
                            type: "literal",
                            value: "/"
                        }
                    ]
                }
            ]);
        });
        test("should handle an escaped forward slash and treat it as a literal", () => {
            expect(tokenize("\\/")).toEqual([
                {
                    quantifier: "exactlyOne",
                    regex: "\\/",
                    type: "element",
                    value: "/"
                }
            ]);
        });
    });
    describe("should handle when { } are used with non-numeric values", () => {
        expect(tokenize("1{3,a}")).toEqual([
            {
                quantifier: "exactlyOne",
                regex: "1",
                type: "literal",
                value: "1",
            },
            {
                quantifier: "exactlyOne",
                regex: "{",
                type: "literal",
                value: "{",
            },
            {
                quantifier: "exactlyOne",
                regex: "3",
                type: "literal",
                value: "3",
            },
            {
                quantifier: "exactlyOne",
                regex: ",",
                type: "literal",
                value: ",",
            },
            {
                quantifier: "exactlyOne",
                regex: "a",
                type: "literal",
                value: "a",
            },
            {
                quantifier: "exactlyOne",
                regex: "}",
                type: "literal",
                value: "}",
            },
        ]);
    });
    describe("should handle when { } are used with numeric values", () => {
        test("should handle minimum quantifier", () => {
            expect(tokenize("a{2,}")).toEqual([
                {
                    quantifier: "atLeast2",
                    regex: "a{2,}",
                    type: "literal",
                    value: "\"a\" repeated at least 2 times",
                },
            ]);
        });
        test("should handle minimum and maximum given", () => {
            expect(tokenize("a{2,5}")).toEqual([
                {
                    quantifier: "2to5",
                    regex: "a{2,5}",
                    type: "literal",
                    value: "\"a\" repeated at least 2 times and no more than 5 times",
                },
            ]);
        });
    });
    describe("should handle quantifiers", () => {
        test("optional greedy", () => {
            expect(tokenize("a?")).toEqual([
                {
                    quantifier: "zeroOrOne",
                    regex: "a?",
                    type: "literal",
                    value: "a",
                },
            ]);
        });
        test("optional lazy", () => {
            expect(tokenize("a??")).toEqual([
                {
                    quantifier: "zeroOrOne-lazy",
                    regex: "a??",
                    type: "literal",
                    value: "a",
                },
            ]);
        });
        test("kleene star greedy", () => {
            expect(tokenize("a*")).toEqual([
                {
                    quantifier: "zeroOrMore",
                    regex: "a*",
                    type: "literal",
                    value: "a",
                },
            ]);
        });
        test("kleene star lazy", () => {
            expect(tokenize("a*?")).toEqual([
                {
                    quantifier: "zeroOrMore-lazy",
                    regex: "a*?",
                    type: "literal",
                    value: "a",
                },
            ]);
        });
        test("kleene plus greedy", () => {
            expect(tokenize("a+")).toEqual([
                {
                    quantifier: "oneOrMore",
                    regex: "a+",
                    type: "literal",
                    value: "a",
                },
            ]);
        });
        test("kleene plus lazy", () => {
            expect(tokenize("a+?")).toEqual([
                {
                    quantifier: "oneOrMore-lazy",
                    regex: "a+?",
                    type: "literal",
                    value: "a",
                },
            ]);
        });
    });
});
