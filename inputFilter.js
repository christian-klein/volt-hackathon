
app.getSharedData().countriesList.classList.add('open');
let inputValue = item.getDisplayValue().toLowerCase();
let valueSubstring;
debugger;
if (inputValue.length > 0) {
    for (let j = 0; j < app.getSharedData().countriesListArray.length; j++) {
        if (!(inputValue.substring(0, inputValue.length) === app.getSharedData().countriesListArray[j].textContent.substring(0, inputValue.length).toLowerCase())) {
            app.getSharedData().countriesListArray[j].classList.add('closed');
        } else {
            app.getSharedData().countriesListArray[j].classList.remove('closed');
        }
    }
} else {
    for (let i = 0; i < app.getSharedData().countriesListArray.length; i++){
    app.getSharedData().countriesListArray[i].classList.remove('closed');
    }
}
  