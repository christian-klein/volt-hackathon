// PAGEVALIDATOR: object to hold validation info
app.getSharedData().pageValidStatus = {
    general: {
        valid: false
    },
    addresses: {
        valid: false
    },
    user: {
        valid: false
    },
    pay: {
        valid: false
    },
    commodity: {
        valid: false
    }
};

// PAGEVALIDATOR: check a page for validity
app.getSharedData().checkValidity = function (page, pageName) {

    app.getSharedData().pageValidStatus[pageName].valid = true;
    var list = page.getChildren();
    for(var i=0; i<list.getLength(); i++) {
        // if(list.get(i).getBOAttr() !== null){
        //     // check validity of BO
        //     if(!list.get(i).getBOAttr().isValid()){
        //         // if(app.getSharedData().pageValidStatus.hasOwnProperty()){
        //             app.getSharedData().pageValidStatus[pageName].valid = false;
        //             return;
        //         // }
        //     }
        // }
        app.getSharedData().checkWidgetValidity(list.get(i), pageName);

        if(app.getSharedData().pageValidStatus[pageName].valid == false) { break }; // once we have a false condition, break out of the loops

    }
    console.log(app.getSharedData().pageValidStatus);
}

// PAGEVALIDATOR: Check a widget and it's children for validity
app.getSharedData().checkWidgetValidity = function (widget, pageName){
    var children = widget.getChildren();
    //check if we have a business object backing this widget
    if(widget.getBOAttr() !== null){
            //check if valid, if not set page to not valid
            // debugger;
            if(!widget.getBOAttr().isValid()){
                app.getSharedData().pageValidStatus[pageName].valid = false;
                return false; //once we have one invalid we can exit
            }
    }

    // now call all the children if there are any
    for(var i=0; i<children.getLength(); i++) {
        // recursion ftw
        app.getSharedData().checkWidgetValidity(children.get(i), pageName);
        if(app.getSharedData().pageValidStatus[pageName].valid == false) { break }; // once we have a false condition, break out of the loops
    }
}

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
    // e_country_field.placeholder = 'Select country';
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