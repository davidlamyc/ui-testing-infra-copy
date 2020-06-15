export default (elementLocator, text) => {
    const actualText = $(currentPage[elementLocator]).getValue();
    if (actualText!== text) {
        throw new Error(`Expected text: ${text}, Actual text: ${actualText}`)
    }
}