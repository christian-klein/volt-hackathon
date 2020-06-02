// ****** START ADDING GLOBAL FUNCTIONS *******
app.getSharedData().loadScript = function (url, callback) {

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement("script");

    script.type = "text/javascript";
    script.src = url;
     
    script.onreadystatechange = callback;
    script.onload = callback;
    
    // Fire the loading
    head.appendChild(script);
}
    
app.getSharedData().loadCSS = function (url, callback) {

    var head = document.getElementsByTagName('head')[0];
    var cssFile = document.createElement("link");

    cssFile.rel = 'stylesheet';  
    cssFile.type = 'text/css'; 
    cssFile.href = url;
        
    cssFile.onreadystatechange = callback;
    cssFile.onload = callback;
    
    // Fire the loading
    head.appendChild(cssFile);
}
// ****** END  ADDING GLOBAL FUNCTIONS *******

var faURL = 'https://kit.fontawesome.com/93511ca699.js';
app.getSharedData().loadScript(faURL, function () {

    var muliURL = '"https://fonts.googleapis.com/css2?family=Muli:ital,wght@1,900&display=swap"';
    app.getSharedData().loadCSS(muliURL, function () {

    });
});
