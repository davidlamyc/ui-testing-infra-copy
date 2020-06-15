export default (elementLocator, text) => {
    const actualText = $(currentPage[elementLocator]).getValue();
    if (actualText.indexOf(text) == -1) {
        throw new Error(`The element's text "${actualText}" does not contain "${text}"`)
    }
}