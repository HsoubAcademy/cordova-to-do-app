var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    domCache: true
});
myApp.onPageInit('addTask', function(page) {
    $$("#navTitle").html('أضف مهمة');
});

myApp.onPageInit('category', function(page) {
    $$("#navTitle").html('تصنيفات المهمة');
});

$$('#addTaskButton').on('click', function(e) {
    if ($$('#minutesInput').val() < 0 || $$('#minutesInput').val() > 59)
        alert('قيمة حقل الدقائق غير صالحة');
    if ($$('#hoursInput').val() < 0 || $$('#hoursInput').val() > 23)
        alert('قيمة حقل الساعة غير صالحة');
});