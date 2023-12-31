function getMinMax(string) {
    const [min, max] = string.split(",");
    return { max, min };
}
const isNumeric = (num) => (typeof num === "number"
        || (typeof num === "string" && num.trim() !== ""))
    && !isNaN(num);

const handleRange = (lastElement, betweenBraces, index, nextElement) => {
    if (!lastElement || lastElement.quantifier !== "exactlyOne") {
        throw new Error("Range must follow an unquantified element");
    }
    const { min, max } = getMinMax(betweenBraces);
    if (!isNumeric(min)) {
        return {
            index,
            token: {
                quantifier: "exactlyOne",
                regex: "{",
                type: "literal",
                value: "{",
            },
        };
    }
    const isLazy = nextElement === "?";
    if (isNumeric(max)) {
        if (min > max)
            throw new Error(
                "Quantifier minimum cannot be greater than maximum",
            );
        if (min === max) {
            lastElement.quantifier = `exactly${min}-${isLazy ? "lazy" : "greedy"}`;
            lastElement.regex += `{${betweenBraces}}`;
            lastElement.value = `"${lastElement.value.repeat(min)}"`;
            return { index: index + betweenBraces.length + 1 + isLazy};
        }
        lastElement.quantifier = `${min}to${max}-${isLazy ? "lazy" : "greedy"}`;
        lastElement.regex += `{${betweenBraces}}`;
        lastElement.value = `"${lastElement.value}" repeated at least ${min} times and no more than ${max} times`;
        return { index: index + betweenBraces.length + 1 + isLazy };
    }
    if (max === "") {
        lastElement.quantifier = `atLeast${min}-${isLazy ? "lazy" : "greedy"}`;
        lastElement.regex += `{${betweenBraces}}`;
        lastElement.value = `"${lastElement.value}" repeated at least ${min} times`;
        return { index: index + betweenBraces.length + 1 + isLazy };
    }
    if (max === undefined) {
        lastElement.quantifier = `exactly${min}-${isLazy ? "lazy" : "greedy"}`;
        lastElement.regex += `{${betweenBraces}}`;
        lastElement.value = `"${lastElement.value.repeat(min)}"`;
        return { index: index + betweenBraces.length + 1 + isLazy };
    }
    return {
        index,
        token: {
            quantifier: "exactlyOne",
            regex: "{",
            type: "literal",
            value: "{",
        }
    };
};

module.exports = { handleRange };
