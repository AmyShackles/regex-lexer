const { getUnicodeCharacter } = require("./getUnicodeCharacter");

const getUnicode = (regexString, index, unicodeFlagSet) => {
    let number, nextIndex;
    // The \u{hhhh} format is only valid when unicodeFlag is set
    // Else, the 'u' is parsed as an escaped 'u' character
    if (regexString[index] === "{") {
        const closingBraceIndex = regexString.indexOf("}", index + 1);
        number = regexString.slice(index + 1, closingBraceIndex);
        nextIndex = closingBraceIndex + 1;

    if (unicodeFlagSet) {
        return getUnicodeCharacter(number, nextIndex, "unicodeExtended");
    }
    if (Number.isInteger(parseInt(number, 10))) {
        return {
            nextIndex,
            token: {
                quantifier: `exactly ${parseInt(number, 10)} times`,
                regex: `\\u{${number}}`,
                type: "literal",
                value: `"u" repeated exactly ${number} times`
            }
        };
    }
    return {
        nextIndex: ++index,
        token: {
            quantifier: "exactlyOne",
            regex: "\\u",
            type: "literal",
            value: "u",
        },
    };
}

    number = regexString.slice(index, index + 4);
    if (isNaN(parseInt(number, 16)) || number.length !== 4) {
        return {
            nextIndex: ++index,
            token: {
                quantifier: "exactlyOne",
                regex: "\\u",
                type: "literal",
                value: "u",
            },
        };
    }
    nextIndex = index + 4;
    const unicodeCharacter = getUnicodeCharacter(number, nextIndex, "unicode");
    return unicodeCharacter;
};

module.exports = { getUnicode };
