export default (text, elementLocator) => {
    $(currentPage[elementLocator]).waitForDisplayed();
    $(currentPage[elementLocator]).selectByVisibleText(text);
}