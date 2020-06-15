module.exports = (element, exactly) => {
    const nrOfElements = $$(currentPage[element]);
    const actualNumberOfElements = nrOfElements.length;
    const expectedNumberOfElement = parseInt(exactly);

    if (actualNumberOfElements !== expectedNumberOfElement) {
        throw new Error(`Element with selector "${element}" should exist exactly ${expectedNumberOfElement} time(s), but appears ${actualNumberOfElements} time(s)`)
    }
};
