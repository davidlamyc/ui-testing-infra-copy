export default (elementLocator, checkIfNotEnabled) => {
    const reverse = checkIfNotEnabled ? true : false;
    $(currentPage[elementLocator]).waitForEnabled({ reverse });
}