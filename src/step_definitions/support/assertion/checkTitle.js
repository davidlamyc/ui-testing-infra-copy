export default (title) => {
    const actualTitle = browser.getTitle();
    if (actualTitle !== title) {
        throw new Error(`Expected title: ${title}, Actual title: ${actualTitle}`)
    }
}