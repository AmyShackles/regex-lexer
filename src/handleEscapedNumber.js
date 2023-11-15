const { getCharacter } = require("./getUnicodeCharacter");
const { getControlCharacterType } = require("./getControlChar");

const handleEscapedNumber = (
    captureList,
    numberOfBackreferences,
    regex,
    index,
    unicodeMode,
    inCharacterSet,
) => {
    const regexString = regex.slice(index);
    const number = getNumber(regexString);
    const length = number.length;
    if (number === "0")
        return {
            nextIndex: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: "\\0",
                type: "characterClass",
                value: "nulCharacter",
            },
        };
    if (number <= numberOfBackreferences && !inCharacterSet) {
        return {
            nextIndex: index + length,
            token: {
                quantifier: "exactlyOne",
                regex: `\\${number}`,
                type: "backreference",
                value: `repeat capture of ${captureList[Number(number) - 1]}`,
            },
        };
    }
    if (unicodeMode) {
        throw new Error("Octal escapes are not valid in unicode mode");
    }
    const octalNumber = parseInt(number, 8);
    if (isNaN(octalNumber)) {
        return {
            nextIndex: index + 1,
            token: {
                quantifier: "exactlyOne",
                regex: `\\${regex[index]}`,
                type: "literal",
                value: regex[index],
            }
        };
    }

    if (octalNumber < 32) {
        const value = getControlCharacterType(octalNumber);
        return {
            nextIndex: index + length,
            token: {
                quantifier: "exactlyOne",
                regex: `\\${number}`,
                type: "controlCharacter",
                value,
            },
        };
    }
    const unicode = getCharacter(octalNumber);
    return {
        nextIndex: index + length,
        token: {
            quantifier: "exactlyOne",
            regex: `\\${number}`,
            type: "octal",
            value: unicode,
        },
    };
};

const getNumber = (regexString) => {
    if (/[0-3]/.test(regexString[0])) {
        if (/[0-7]/.test(regexString[1])) {
            if (/[0-7]/.test(regexString[2])) {
                return regexString.slice(0, 3);
            }
            return regexString.slice(0, 2);
        }
        return regexString.slice(0, 1);
    } else if (/[4-7]/.test(regexString[0])) {
        if (/[1-7]/.test(regexString[1])) {
            return regexString.slice(0, 2);
        }
        return regexString.slice(0, 1);
    }
    return regexString.slice(0, 1);
};

module.exports = { handleEscapedNumber };
