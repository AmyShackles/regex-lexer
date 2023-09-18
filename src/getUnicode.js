const { getUnicodeCharacter } = require("./getUnicodeCharacter");

const getUnicode = (regexString, index, unicodeFlagSet) => {
    let hex, nextIndex;
    // The \u{hhhh} format is only valid when unicodeFlag is set
    // Else, the 'u' is parsed as an escaped 'u' character
    if (unicodeFlagSet && regexString[index] === "{") {
        const closingBraceIndex = regexString.indexOf("}", index + 1);
        hex = regexString.slice(index + 1, closingBraceIndex);
        nextIndex = closingBraceIndex + 1;
        return getUnicodeCharacter(hex, nextIndex, "unicodeExtended");
    } else if (!unicodeFlagSet && regexString[index] === "{") {
        throw new Error(
            "Invalid use of extended unicode outside of unicode mode",
        );
    }

    hex = regexString.slice(index, index + 4);
    if (isNaN(parseInt(hex, 16)) || hex.length !== 4) {
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
    const unicodeCharacter = getUnicodeCharacter(hex, nextIndex, "unicode");
    return unicodeCharacter;
};

module.exports = { getUnicode };
