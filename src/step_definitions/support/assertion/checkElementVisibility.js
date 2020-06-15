export default (checkIsNotVisible, elementLocator) => {
    const reverse = checkIsNotVisible ? true : false;
    $(currentPage[elementLocator]).waitForDisplayed({ reverse });
}