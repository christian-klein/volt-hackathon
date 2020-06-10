// Initialize

// PAGEVALIDATOR: object to hold validation info
app.getSharedData().configuration = {
    global: {
        formName: "F_Vendor_Registration",
        headerHTMLTemplatePage: "P_Welcome",
        headerHTMLTemplateField: "F_HTMLHeader_Welcome"
    },
    pages: {
        P_Splash: {
            valid: true,
            hasBeenVisited: true,
            copyHeaderTo: false,
            headerHTMLField: ""
        },
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
debugger;
    let currentPageId;

    if (!form.getCurrentPage()){
        // first time show is called on the page, curentPage returns null, so we just get the first page
        currentPageId = form.getPageIds()[0];
    }else{
        currentPageId = form.getCurrentPage().getId();
    }

    for (let pagekey of form.getPageIds()) {
        if (pagekey == currentPageId) {
            app.getSharedData().highlightPage(pagekey);
        } else {
            app.getSharedData().removeHighlightPage(pagekey);
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
  srv.connectEvent('onCallFinished', function(success)
   {
    if(success) {
      app.getSharedData().countriesList = document.querySelector('.value-list');
      app.getSharedData().countriesListTable = BO.F_CountriesTable;
      app.getSharedData().countriesListTableLength = BO.F_CountriesTable.getLength();

      for(var i = 0; i < app.getSharedData().countriesListTableLength; i++) {
        app.getSharedData().loadCoutriesListItem(app.getSharedData().countriesList, BO.F_CountriesTable.get(i).F_CountryTableName.getValue());
      }

      app.getSharedData().countriesListArray = [...document.querySelectorAll('.value-list li')];
      // add an onClick event to push the clicked country into the country field and close the country list
      app.getSharedData().countriesListArray.forEach(list_item => {
        list_item.addEventListener('click', evt => {
          BO.F_CountryFilter.setValue(list_item.textContent);
          app.getSharedData().countriesListArray.forEach(dropdown => {
            // app.getSharedData().countriesList.classList.remove('open');
            dropdown.classList.add('closed');
          });
        });
      });
      
    }
});

// COUNTRIES: helper function to create the listitems
app.getSharedData().loadCoutriesListItem = function (listItem, list_item_name) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(list_item_name));
    listItem.appendChild(li);
}

// COUNTRIES: register keydown event to cover clearing the field since Volts onItemLiveChange is not triggering when
// the last character is deleted
var e_country_field = document.querySelector('.country-field');

e_country_field.addEventListener("keyup", function () {

    var f_country = form.getPage('P_Addresses').F_CountryFilter.getDisplayValue(); 
    if( !f_country){
        for (let i = 0; i < app.getSharedData().countriesListArray.length; i++){
            app.getSharedData().countriesListArray[i].classList.remove('closed');
        }
    }
});

// COUNTRIES: Have to use the JS blur over the Volt blur since it is to aggressive and closes list even on scrollbar click
// of the countries list
e_country_field.addEventListener('blur', () => {
    app.getSharedData().countriesList.classList.remove('open');
  });

// COUNTRIES: Catch the click event and ensure the hiding of the box only when outside the areas
document.addEventListener('click', evt => {
    const isDropdown = app.getSharedData().countriesList.contains(evt.target);
    const isInput = e_country_field.contains(evt.target);
    if (!isDropdown && !isInput) {
        app.getSharedData().countriesList.classList.remove('open');
    }
  });