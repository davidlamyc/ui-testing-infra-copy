export default (isCSS, attrName, elementLocator, falseCase, expectedValue) => {
    $(currentPage[elementLocator]).waitForDisplayed();
    
	const command = isCSS ? "getCSSProperty" : "getAttribute";

	const attrType = (isCSS ? "CSS attribute" : "Attribute");

	let attributeValue = $(currentPage[elementLocator])[command](attrName);

	if (attrName.match(/(color|font-weight)/)) {
		attributeValue = attributeValue.value;
	}

	if (falseCase) {
        if (attributeValue === expectedValue) {
            throw new Error(`${attrType} of element "${elementLocator}" should not contain ` +
            `"${attributeValue}"`)
        }
	} else {
        if (attributeValue !== expectedValue) {
            throw new Error(`${attrType} of element "${elementLocator}" should not contain ` +
            `"${attributeValue}", but "${expectedValue}"`)
        }
	}
};
