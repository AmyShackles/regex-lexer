const { handleRange } = require("../src/handleRange");

describe("handleRange", () => {
    test("should handle minimum quantifier", () => {
        const lastElement = {
            quantifier: "exactlyOne",
            regex: "i",
            type: "literal",
            value: "i"
        };
        const betweenBraces = "3,";
        const index = 2;
        handleRange(lastElement, betweenBraces, index);
        expect(lastElement.quantifier).toEqual("atLeast3");
    });
});
