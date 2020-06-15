export default (elementLocator, text) => {
    $(currentPage[elementLocator]).waitForDisplayed();
    $(currentPage[elementLocator]).setValue(text);
}