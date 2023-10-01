const { handleQuantifiers } = require("../src/handleQuantifiers.js");

describe("handleQuantifiers", () => {
    describe("handle Kleene star", () => {
        test("should throw an error if lastElement has a quantity other than 'exactlyOne'", () => {
            const lastElement = {
                quantifier: "oneOrMore",
                regex: "i+",
                type: "literal",
                value: "i",
            };
            const nextChar = ".";
            function testError() {
                handleQuantifiers("*", lastElement, nextChar, 2);
            }
            expect(testError).toThrowError(
                new Error(
                    `Quantifier must follow an unquantified element, but last element was ${JSON.stringify(
                        lastElement,
                        null,
                        2
                    )} at index 2\n`
                )
            );
            expect(lastElement.quantifier).toEqual("oneOrMore");
            expect(lastElement.regex).toEqual("i+");
        });
        test("should return the new index if greedy", () => {
            const lastElement = {
                quantifier: "exactlyOne",
                regex: "i",
                type: "literal",
                value: "i",
            };
            const nextChar = ".";
            expect(handleQuantifiers("*", lastElement, nextChar, 1)).toEqual(2);
            expect(lastElement.quantifier).toEqual("zeroOrMore");
            expect(lastElement.regex).toEqual("i*");
        });
        test("should return the new index if lazy", () => {
            const lastElement = {
                quantifier: "exactlyOne",
                regex: "i",
                type: "literal",
                value: "i",
            };
            const nextChar = "?";
            expect(handleQuantifiers("*", lastElement, nextChar, 1)).toEqual(3);
            expect(lastElement.quantifier).toEqual("zeroOrMore-lazy");
            expect(lastElement.regex).toEqual("i*?");
        });
    });
    describe("handle Kleene plus", () => {
        test("should throw an error if lastElement has a quantity other than 'exactlyOne'", () => {
            const lastElement = {
                quantifier: "zeroOrMore",
                regex: "i*",
                type: "literal",
                value: "i",
            };
            const nextChar = ".";
            function testError() {
                handleQuantifiers("+", lastElement, nextChar, 2);
            }
            expect(testError).toThrowError(
                new Error(
                    `Quantifier must follow an unquantified element, but last element was ${JSON.stringify(
                        lastElement,
                        null,
                        2
                    )} at index 2\n`
                )
            );
            expect(lastElement.quantifier).toEqual("zeroOrMore");
            expect(lastElement.regex).toEqual("i*");
        });
        test("should return the new index if greedy", () => {
            const lastElement = {
                quantifier: "exactlyOne",
                regex: "i",
                type: "literal",
                value: "i",
            };
            const nextChar = ".";
            expect(handleQuantifiers("+", lastElement, nextChar, 1)).toEqual(2);
            expect(lastElement.quantifier).toEqual("oneOrMore");
            expect(lastElement.regex).toEqual("i+");
        });
        test("should return the new index if lazy", () => {
            const lastElement = {
                quantifier: "exactlyOne",
                regex: "i",
                type: "literal",
                value: "i",
            };
            const nextChar = "?";
            expect(handleQuantifiers("+", lastElement, nextChar, 1)).toEqual(3);
            expect(lastElement.quantifier).toEqual("oneOrMore-lazy");
            expect(lastElement.regex).toEqual("i+?");
        });
    });
    describe("handle optional", () => {
        test("should throw an error if lastElement has a quantity other than 'exactlyOne'", () => {
            const lastElement = {
                quantifier: "oneOrMore",
                regex: "i+",
                type: "literal",
                value: "i",
            };
            const nextChar = ".";
            function testError() {
                handleQuantifiers("?", lastElement, nextChar, 2);
            }
            expect(testError).toThrowError(
                new Error(
                    `Quantifier must follow an unquantified element, but last element was ${JSON.stringify(
                        lastElement,
                        null,
                        2
                    )} at index 2\n`
                )
            );
            expect(lastElement.quantifier).toEqual("oneOrMore");
            expect(lastElement.regex).toEqual("i+");
        });
        test("should return the new index if greedy", () => {
            const lastElement = {
                quantifier: "exactlyOne",
                regex: "i",
                type: "literal",
                value: "i",
            };
            const nextChar = ".";
            expect(handleQuantifiers("?", lastElement, nextChar, 1)).toEqual(2);
            expect(lastElement.quantifier).toEqual("zeroOrOne");
            expect(lastElement.regex).toEqual("i?");
        });
        test("should return the new index if lazy", () => {
            const lastElement = {
                quantifier: "exactlyOne",
                regex: "i",
                type: "literal",
                value: "i",
            };
            const nextChar = "?";
            expect(handleQuantifiers("?", lastElement, nextChar, 1)).toEqual(3);
            expect(lastElement.quantifier).toEqual("zeroOrOne-lazy");
            expect(lastElement.regex).toEqual("i??");
        });
    });
    test("quantifier unknown", () => {
        const lastElement = {
            quantifier: "exactlyOne",
            regex: "i",
            type: "literal",
            value: "i",
        };
        expect(() => {

            handleQuantifiers("!", lastElement, ".", 1);
        }).toThrowError("Unknown quantifier \"!\"");
        expect(lastElement.quantifier).toEqual("exactlyOne");
        expect(lastElement.regex).toEqual("i");
    });
});
