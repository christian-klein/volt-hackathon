// Initialize

// PAGEVALIDATOR: object to hold validation info
app.getSharedData().configuration = {
    global: {
        formName: "F_Vendor_Registration",
        headerHTMLTemplatePage: "P_Welcome",
        headerHTMLTemplateField: "F_HTMLHeader_Welcome"
    },
    pages: {
        P_Welcome: {
            valid: false,
            hasBeenVisited: false,
            copyHeaderTo: false,
            headerHTMLField: "F_HTMLHeader_Welcome"
        },
        P_General: {
            valid: false,
            hasBeenVisited: false,
            copyHeaderTo: true,
            headerHTMLField: "F_HTMLHeader_General"
        },
        P_Addresses: {
            valid: false,
            hasBeenVisited: false,
            copyHeaderTo: true,
            headerHTMLField: "F_HTMLHeader_Addresses"
        },
        P_User: {
            valid: false,
            hasBeenVisited: false,
            copyHeaderTo: true,
            headerHTMLField: "F_HTMLHeader_User"
        },
        P_Pay: {
            valid: false,
            hasBeenVisited: false,
            copyHeaderTo: true,
            headerHTMLField: "F_HTMLHeader_Pay"
        },
        P_Code: {
            valid: false,
            hasBeenVisited: false,
            copyHeaderTo: true,
            headerHTMLField: "F_HTMLHeader_Codes"
        }
    },
    filteredLists: {
        countries: {
            addressCountries: {
                field: "F_CountryFilter",
                listPage: "P_Addresses",
                listStyleId: "vh-id-filterlist-addresses",
                valuesTableName: "F_CountriesTable",
                valuesFieldName: "F_CountryTableName"
            },
            payCountries: {
                field: "F_BankCountry",
                listPage: "P_Pay",
                listStyleId: "vh-id-filterlist-pay",
                valuesTableName: "F_CountriesTable",
                valuesFieldName: "F_CountryTableName"
            }
        }
    }
};

var formName = app.getSharedData().configuration.global.formName;
var headerHTMLTemplatePage = app.getSharedData().configuration.global.headerHTMLTemplatePage;
var headerHTMLTemplateField = app.getSharedData().configuration.global.headerHTMLTemplateField;
var headerHTML = get(form.getPage(headerHTMLTemplatePage), headerHTMLTemplateField).getContent();

form.getPage("P_Code").B_Submit.setVisible(false);

/* -------------------------------------------------------------------------------------------------------------------
                                                   HEADER / PAGE NAV
   -------------------------------------------------------------------------------------------------------------------*/

// PAGE SETUP: Add the html header to all pages
for (let pagekey of Object.keys(app.getSharedData().configuration.pages)) {

    let copyHeaderTo = app.getSharedData().configuration.pages[pagekey].copyHeaderTo;
    let headerHTMLField = app.getSharedData().configuration.pages[pagekey].headerHTMLField;

    if (copyHeaderTo && (headerHTMLTemplatePage != pagekey && headerHTMLTemplateField != headerHTMLField)) {
        get(form.getPage(pagekey), headerHTMLField).setContent(headerHTML);
    }
}

// PAGENAVIGATOR: Navigate to a page
app.getSharedData().navigateToPage = function (pageName) {

    form.selectPage(pageName);
    app.getSharedData().navigateToPageTriggers();

}

// PAGENAVIGATOR: Navigate to a page
app.getSharedData().navigateToPageTriggers = function () {

    if (form.getCurrentPage()) // initial render calls show with no current page set
        app.getSharedData().configuration.pages[form.getCurrentPage().getId()].hasBeenVisited = true;

    app.getSharedData().checkValidityAllPages();
    app.getSharedData().adjustHeader();
    app.getSharedData().highlightCurrentPage();

}

// PAGEVALIDATOR: set page highlights
app.getSharedData().highlightCurrentPage = function () {

    if (form.getCurrentPage()) { // initial render calls show with no current page set
        for (let pagekey of form.getPageIds()) {
            if (pagekey == form.getCurrentPage().getId()) {
                app.getSharedData().highlightPage(pagekey);
            } else {
                app.getSharedData().removeHighlightPage(pagekey);
            }
        }

    }
}

// PAGEVALIDATOR: highlight current page
app.getSharedData().highlightPage = function (page) {

    let pageText = document.querySelectorAll('.vh-id-header-' + page + '-text');
    for (let i = 0; i < pageText.length; i++) {
        pageText[i].classList.add('vh-highlight-current');
    }
}

// PAGEVALIDATOR: remove highlight from current page
app.getSharedData().removeHighlightPage = function (page) {
    let pageText = document.querySelectorAll('.vh-id-header-' + page + '-text');
    for (let i = 0; i < pageText.length; i++) {
        pageText[i].classList.remove('vh-highlight-current');
    }
}

// PAGEVALIDATOR: step through all icons and adjust coloring based on validity
app.getSharedData().adjustHeader = function () {

    var stateObject = app.getSharedData().configuration.pages;
    var pageStatus = false;

    for (let pagekey of Object.keys(stateObject)) {
        pageStatus = stateObject[pagekey].valid;
        let pageHasBeenVisited = stateObject[pagekey].hasBeenVisited;
        let pageIcon = document.querySelectorAll('.vh-id-header-' + pagekey);
        let pageCheck = document.querySelectorAll('.vh-id-header-' + pagekey + '-check');

        // only check pages that are valid and have been visisted at least once
        if (pageStatus && pageHasBeenVisited) {
            for (let i = 0; i < pageIcon.length; i++) {
                pageIcon[i].classList.add('vh-green-fade');
            }
            for (let i = 0; i < pageCheck.length; i++) {
                pageCheck[i].classList.remove('vh-hidden');
            }
        } else {
            for (let i = 0; i < pageIcon.length; i++) {
                pageIcon[i].classList.remove('vh-green-fade');
            }

            for (let i = 0; i < pageCheck.length; i++) {
                pageCheck[i].classList.add('vh-hidden');
            }
        }
    }
}

// PAGEVALIDATOR: check all pages for validity
app.getSharedData().checkValidityAllPages = function () {
    for (let navitem in app.getSharedData().configuration.pages) {
        app.getSharedData().checkValidity(navitem);
    }

    if (BO.isValid())
        form.getPage("P_Code").B_Submit.setVisible(true);
}

// PAGEVALIDATOR: check a page for validity
app.getSharedData().checkValidity = function (pageName) {
    app.getSharedData().configuration.pages[pageName].valid = true;

    let pageObject = form.getPage(pageName);
    let list = pageObject.getChildren();
    for (let i = 0; i < list.getLength(); i++) {
        app.getSharedData().checkWidgetValidity(list.get(i), pageName);

        if (app.getSharedData().configuration.pages[pageName].valid == false) { break }; // once we have a false condition, break out of the loops

    }
}

// PAGEVALIDATOR: Check a widget and it's children for validity
app.getSharedData().checkWidgetValidity = function (widget, pageName) {
    var children = widget.getChildren();
    //check if we have a business object backing this widget
    try {
        // check if our widget has a business object and is not a table
        if (widget.getBOAttr() !== null && widget.getType() !== "aggregationListContainer") {
            //check if valid, if not set page to not valid
            if (!widget.getBOAttr().isValid()) {
                app.getSharedData().configuration.pages[pageName].valid = false;
                return false; //once we have one invalid we can exit
            }
        }
    } catch (error) {
        return; // if we have no business object, just cancel the check
    }

    // now call all the children if there are any
    for (var i = 0; i < children.getLength(); i++) {
        // recursion ftw
        app.getSharedData().checkWidgetValidity(children.get(i), pageName);
        if (app.getSharedData().configuration.pages[pageName].valid == false) { break }; // once we have a false condition, break out of the loops
    }
}

/* -------------------------------------------------------------------------------------------------------------------
                                                          Countries
   -------------------------------------------------------------------------------------------------------------------*/

// COUNTRIES: populate the <UL> with the countries from the table the service populated once the service is done
var srv = form.getServiceConfiguration("SC_AllCountriesTable");
srv.connectEvent('onCallFinished', function (success) {
    if (success) {

        //step through boxes and populate them
        for (let listName in app.getSharedData().configuration.filteredLists.countries) {
            app.getSharedData().populateFilteredList('countries', listName);
        }

        // TODO: Move below into helper function we called above
        // listConfig.countriesList = document.querySelector('.vh-id-filterlist-addresses');
        // listConfig.countriesListTable = BO.F_CountriesTable;
        // listConfig.countriesListTableLength = BO.F_CountriesTable.getLength();

        // for (var i = 0; i < listConfig.countriesListTableLength; i++) {
        //     app.getSharedData().loadCoutriesListItem(listConfig.countriesList, BO.F_CountriesTable.get(i).F_CountryTableName.getValue());
        // }

        // listConfig.countriesvalueListArray = [...document.querySelectorAll('.vh-id-filterlist-addresses li')];
        // // add an onClick event to push the clicked country into the country field and close the country list
        // listConfig.countriesvalueListArray.forEach(list_item => {
        //     list_item.addEventListener('click', evt => {
        //         BO.F_CountryFilter.setValue(list_item.textContent);
        //         listConfig.countriesvalueListArray.forEach(dropdown => {
        //             dropdown.classList.add('closed');
        //         });
        //     });
        // });
    }
});

// filteredLists: {
//     countries: {
//         addressCountries: {
//             field: "F_CountryFilter",
//             listPage: "P_Addresses",
//             listStyleId: "vh-id-filterlist-addresses",
//             valuesTableName: "F_CountriesTable",
//             valuesFieldName: "F_CountriesTableName"
//         },
//         payCountries: {
//             field: "F_BankCountry",
//             listPage: "P_Pay",
//             listStyleId: "vh-id-filterlist-pay",
//             valuesTableName: "F_CountriesTable",
//             valuesFieldName: "F_CountriesTableName"
//             // (Generated) valueField: BO field object
//             // (Generated) valueListTable: BO of table holding values
//             // (Generated) valueList : <UL> HTML of values based on style class
//             // (Generated) valueListArray: <LI> list of HTML elements
//         }
//     }
// }



// FILTERED DROPDOWN: helper function to create the listitems and attach event
app.getSharedData().populateFilteredList = function (listType, listName) {

    //get config
    let listConfig = app.getSharedData().configuration.filteredLists[listType][listName];

    listConfig.valueField = get (BO, listConfig.field);
    listConfig.valueListTable = get(BO, listConfig.valuesTableName);
    // listConfig.valueList = document.querySelector('.'+listConfig.listStyleId);

    for (var i = 0; i < listConfig.valueListTable.getLength(); i++) {
        app.getSharedData().loadFilteredListItem(listConfig.valueList, listConfig.valueListTable.get(i)[listConfig.valuesFieldName].getValue());
    }

    debugger;


    listConfig.valueListArray = [...document.querySelectorAll('.'+listConfig.listStyleId+' li')];
    // add an onClick event to push the clicked value into the data field field and close the list
    listConfig.valueListArray.forEach(list_item => {
        list_item.addEventListener('click', evt => {
            listConfig.valueField.setValue(list_item.textContent);
            listConfig.valueListArray.forEach(dropdown => {
                dropdown.classList.add('closed');
            });
        });
    });

    // register keydown event to cover clearing the field since Volts onItemLiveChange is not triggering when
    // the last character is deleted
    listConfig.valueField.addEventListener("keyup", function (e) {

        if (!listConfig.valueField.getDisplayValue()) {
            for (let i = 0; i < listConfig.valueListArray.length; i++) {
                listConfig.valueListArray[i].classList.remove('closed');
            }
        }
    });

    // Have to use the JS blur over the Volt blur since it is to aggressive and closes list even on scrollbar click
    // of the countries list
    listConfig.valueField.addEventListener('blur', () => {
        listConfig.valueList.classList.remove('open');
});
}


// FILTERED DROPDOWN: helper function to create the listitems
app.getSharedData().loadFilteredListItem = function (valueList, list_item_name) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(list_item_name));
    valueList.appendChild(li);
}

// FILTERED DROPDOWN: Catch the click event and ensure the hiding of the box only when outside the areas
document.addEventListener('click', evt => {

    //we need to iterate over all lists
    if(app.getSharedData().configuration){
        for (let listType in app.getSharedData().configuration.filteredLists) {
            for (let listConfig in app.getSharedData().configuration.filteredLists[listType]) {
                
                if(listConfig.valueList && listConfig.valuesField){
                    const isDropdown = listConfig.valueList.contains(evt.target);
                    const isInput = listConfig.valueField.contains(evt.target);
    
                    if (!isDropdown && !isInput) {
                        app.getSharedData().valueList.classList.remove('open');
                    }
                }
            }
        }
    }
});