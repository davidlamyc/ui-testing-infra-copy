export default (clickOrDoubleClick, elementLocator) => {
    $(currentPage[elementLocator]).waitForDisplayed();
    if (clickOrDoubleClick === 'doubleclick') {
        $(currentPage[elementLocator]).doubleClick();
    } else {
        $(currentPage[elementLocator]).click();
    }
}