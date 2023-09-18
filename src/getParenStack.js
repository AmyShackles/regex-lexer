const getParenStack = (string) => {
    const openParen = [];
    const captures = [];
    [...string].forEach((char, index) => {
        /* istanbul ignore else */
        if (char === "(") {
            /* istanbul ignore else */
            if ((index > 0 && string[index - 1] !== "\\") | index == 0) {
                openParen.push(index);
            }
        } else if (char === ")") {
            if (index > 0 && string[index - 1] !== "\\") {
                const match = openParen.pop();
                const group = string.slice(match, index + 1);
                captures.push(group);
            }
        }
    });
    return captures;
};

module.exports = { getParenStack };
