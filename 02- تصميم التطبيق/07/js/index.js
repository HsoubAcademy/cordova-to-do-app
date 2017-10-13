var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    domCache: true
});
myApp.onPageInit('addTask', function(page) {
    $$("#navTitle").html('أضف مهمة');
});