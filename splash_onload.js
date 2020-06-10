var jqURL = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js";
var jqlURL = "https://github.com/downloads/davatron5000/Lettering.js/jquery.lettering-0.6.1.min.js";

require([jqURL], function () {
    require([jqlURL], function () {
        $(".cs-text-cut").lettering('words');
    });
});
