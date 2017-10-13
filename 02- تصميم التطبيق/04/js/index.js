var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    domCache: true //enable inline pages
});
myApp.onPageInit('index', function(page) {
    $$("#navTitle").html('Riyad')
});