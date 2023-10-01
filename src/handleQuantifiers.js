const handleQuantifiers = (quantifier, lastElement, nextChar, index) => {
    if (!lastElement || lastElement.quantifier !== "exactlyOne") {
        throw new Error(
            `Quantifier must follow an unquantified element, but last element was ${JSON.stringify(lastElement, null, 2)} at index ${index}\n`
        );
    }
    switch (quantifier) {
        case "*": {
            lastElement.quantifier = "zeroOrMore";
            lastElement.regex += "*";
            break;
        };
        case "+": {
            lastElement.quantifier = "oneOrMore";
            lastElement.regex += "+";
            break;
        }
        case "?": {
            lastElement.quantifier = "zeroOrOne";
            lastElement.regex += "?";
            break;
        }
        default:
            throw new Error(`Unknown quantifier "${quantifier}"`);
    }
    index++;
    if (nextChar === "?") {
        lastElement.quantifier += "-lazy";
        lastElement.regex += "?";
        index++;
    }
    return index;
};

module.exports = { handleQuantifiers };
