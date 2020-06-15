export default (elementLocator, notSelectedString) => {
    let checkIfNotSelected = notSelectedString ? true : false;
    const isSelected = $(currentPage[elementLocator]).isSelected();
    
    if (checkIfNotSelected) {
        if (isSelected === true) {
            throw new Error(`Element ${elementLocator} is selected when it should not be selected.`)
        }
    } else {
        if (isSelected === false) {
            throw new Error(`Element ${elementLocator} is not selected when it should be selected.`)
        }
    }
}