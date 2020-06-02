var country = BO.F_Addr_Country1.getValue();
var zip = BO.F_Addr_Zip1.getValue();

app.getSharedData().addrCountry = country;
app.getSharedData().addrZip = zip;

// debugger;

if ((country && zip) && (app.getSharedData().addrCountry !== country || app.getSharedData().addrZip !== zip)) {

    form.getServiceConfiguration("SC_PostalCodeLookup").callService();

    // var srv_zip = form.getServiceConfiguration('SC_PostalCodeLookup');
    // var hdl_zip = srv_zip.connectEvent("onCallFinished", function(success){
    //     if(success){
    //     }
    // });
}
form.disconnectEvent(hdl_zip);



app.getSharedData().loadCSS = function (url, callback) {

    var head = document.getElementsByTagName('head')[0];
    var css = document.createElement("link")
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'style.css';



    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(css);
}

var faURL = '"https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap"';

app.getSharedData().loadScript(faURL, function () {

});



var openSansSerifURL = '"https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap"';
app.getSharedData().loadCSS(openSansSerifURL, function () { });


app.getSharedData().loadCSS = function (url, callback) {

    var head = document.getElementsByTagName('head')[0];
    var cssFile = document.createElement("link")
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;

    cssFile.onreadystatechange = callback;
    cssFile.onload = callback;

    // Fire the loading
    head.appendChild(cssFile);
}


var faURL = 'https://kit.fontawesome.com/93511ca699.js';
app.getSharedData().loadScript(faURL, function () {

    var openSansSerifURL = '"https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&display=swap"';
    app.getSharedData().loadCSS(openSansSerifURL, function () { });


});

var actions = form.getStageActions();
for (var i = 0; i < actions.length; i++) {
    if (get(actions, i).getId() === 'S_Submit') {
        get(actions, i).activate();
        break;
    }
}


var actions = form.getStageActions();

for (var i=0; actions.length(); i++){
  if(get(actions,i).getId() === 'S_Submit'){
    get(actions,i).setVisible(false);
  }
}

var actions = form.getStageActions();

for (var i=0; actions.length(); i++){
  if(get(actions,i).getId() === 'S_Submit'){
    get(actions,i).activate();
  }
}