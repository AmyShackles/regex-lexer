const getControlChar = (controlChar) => {
    const lowerCaseControlChar = controlChar.toLowerCase();
    const controlCharNumericValue = lowerCaseControlChar.charCodeAt(0) - "a".charCodeAt(0) + 1;
    if (controlCharNumericValue >= 1 && controlCharNumericValue <= 26) {
        return {
            quantifier: "exactlyOne",
            regex: `\\c${controlChar}`,
            type: "controlCharacter",
            value: getControlCharacterType(controlCharNumericValue)
        };
    } 
    // Control characters only include
    // \ca - \cz (case insensitive)
    // So if the value after c is anything else,
    // Match a backslash and c literally
    return (
        [
            {
                quantifier: "exactlyOne",
                regex: "\\",
                type: "literal",
                value: "\\",
            },
            {
                quantifier: "exactlyOne",
                regex: "\\",
                type: "literal",
                value: "\\",
            },
            {
                quantifier: "exactlyOne",
                regex: "c",
                type: "literal",
                value: "c",
            },
        ]
    );
};

function getControlCharacterType(codepoint) {
    switch (codepoint) {
        case 0:
            return "NUL";
        case 1:
            return "startOfHeading";
        case 2:
            return "startOfText";
        case 3:
            return "endOfText";
        case 4:
            return "endOfTransmit";
        case 5:
            return "enquiry";
        case 6:
            return "acknowledge";
        case 7:
            return "bell";
        case 8:
            return "backspace";
        case 9:
            return "horizontalTab";
        case 10:
            return "lineFeed";
        case 11:
            return "verticalTab";
        case 12:
            return "formFeed";
        case 13:
            return "carriageReturn";
        case 14:
            return "shiftOut";
        case 15:
            return "shiftIn";
        case 16:
            return "dataLineEscape";
        case 17:
            return "deviceControl1";
        case 18:
            return "deviceControl2";
        case 19:
            return "deviceControl3";
        case 20:
            return "deviceControl4";
        case 21:
            return "negativeAcknowledge";
        case 22:
            return "synchronousIdle";
        case 23:
            return "endOfTransmitBlock";
        case 24:
            return "cancel";
        case 25:
            return "endOfMedium";
        case 26:
            return "substitute";
        case 27:
            return "escape";
        case 28:
            return "fileSeparator";
        case 29:
            return "groupSeparator";
        case 30:
            return "recordSeparator";
        case 31:
            return "unitSeparator";
        default:
            throw new Error("Invalid control character");
    }
}

module.exports = { getControlChar, getControlCharacterType };
