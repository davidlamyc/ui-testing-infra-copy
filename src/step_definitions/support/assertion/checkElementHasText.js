export default (elementLocator, text) => {
    const actualText = $(currentPage[elementLocator]).getText();
    if (actualText!== text) {
        throw new Error(`Expected text: ${text}, Actual text: ${actualText}`)
    }
}