const { handleRange } = require("../src/handleRange");

describe("handleRange", () => {
    const lastElementUnquantified = {
        quantifier: "exactlyOne",
        regex: "i",
        type: "literal",
        value: "i",
    };
    test("should handle minimum quantifier", () => {
        const lastElement = { ...lastElementUnquantified };
        const betweenBraces = "3,";
        const index = 5;
        const result = handleRange(lastElement, betweenBraces, index);
        expect(lastElement.quantifier).toEqual("atLeast3");
        expect(lastElement.regex).toEqual(`${lastElementUnquantified.regex}{${betweenBraces}}`);
        expect(lastElement.value).toEqual(`"${lastElementUnquantified.value}" repeated at least 3 times`);
        expect(result).toEqual({index: index + betweenBraces.length + 1});
    });
    test("should handle if no minimum quantifier given", () => {
        const lastElement = { ...lastElementUnquantified };
        const betweenBraces = ",5";
        const index = 2;
        const result = handleRange(lastElement, betweenBraces, index);
        expect(result).toEqual({index: index + 1, token: { quantifier: "exactlyOne", regex: "{", type: "literal", value: "{"}});
        expect(lastElement.quantifier).toEqual("exactlyOne");
    });
    test("should handle if minimum quantifier is not numeric", () => {
        const lastElement = { ...lastElementUnquantified };
        const betweenBraces = "a,5";
        const index = 2;
        const result = handleRange(lastElement, betweenBraces, index);
        expect(result).toEqual({index: index + 1, token: { quantifier: "exactlyOne", regex: "{", type: "literal", value: "{"}});
        expect(lastElement.quantifier).toEqual("exactlyOne");
    });
    test("should handle minimum and maximum quantifiers", () => {
        const lastElement = { ...lastElementUnquantified };
        const betweenBraces = "3,5";
        const index = 2;
        const result = handleRange(lastElement, betweenBraces, index);
        expect(lastElement.quantifier).toEqual("3to5");
        expect(lastElement.regex).toEqual(`${lastElementUnquantified.regex}{${betweenBraces}}`);
        expect(lastElement.value).toEqual(`"${lastElementUnquantified.value}" repeated at least 3 times and no more than 5 times`);
        expect(result).toEqual({index: index + betweenBraces.length + 1});
    });
    test("should handle if minimum and maximum quantifiers are the same", () => {
        const lastElement = { ...lastElementUnquantified };
        const betweenBraces = "3,3";
        const index = 2;
        const result = handleRange(lastElement, betweenBraces, index);
        expect(lastElement.quantifier).toEqual("exactly3");
        expect(lastElement.regex).toEqual(`${lastElementUnquantified.regex}{${betweenBraces}}`);
        expect(lastElement.value).toEqual(`"${lastElementUnquantified.value.repeat(3)}"`);
        expect(result).toEqual({index: index + betweenBraces.length + 1});
    });
    test("should handle if only one quantifier given", () => {
        const lastElement = { ...lastElementUnquantified };
        const betweenBraces = "7";
        const index = 2;
        const result = handleRange(lastElement, betweenBraces, index);
        expect(lastElement.quantifier).toEqual("exactly7");
        expect(lastElement.regex).toEqual(`${lastElementUnquantified.regex}{${betweenBraces}}`);
        expect(lastElement.value).toEqual(`"${lastElementUnquantified.value.repeat(7)}"`);
        expect(result).toEqual({index: index + betweenBraces.length + 1});
    });
    test("should handle if maximum quantifier is not numeric", () => {
        const lastElement = { ...lastElementUnquantified };
        const betweenBraces = "3,a";
        const index = 2;
        const result = handleRange(lastElement, betweenBraces, index);
        expect(result).toEqual({index: index + 1, token: { quantifier: "exactlyOne", regex: "{", type: "literal", value: "{"}});
        expect(lastElement.quantifier).toEqual("exactlyOne");
    });
    test("should throw if previous element is quantified", () => {
        const lastElement = { ...lastElementUnquantified, quantifier: "zeroOrMore"};
        const betweenBraces = "3,";
        const index = 2;
        expect(() => {
            handleRange(lastElement, betweenBraces, index);
        }).toThrowError("Range must follow an unquantified element");
        expect(lastElement.quantifier).toEqual("zeroOrMore");
    });
    test("should throw if minimum quantifier is larger than maximum", () => {
        const lastElement = { ...lastElementUnquantified };
        const betweenBraces = "3,1";
        const index = 2;
        expect(() => {
            handleRange(lastElement, betweenBraces, index);
        }).toThrowError("Quantifier minimum cannot be greater than maximum");
        expect(lastElement.quantifier).toEqual("exactlyOne");
    });
});
