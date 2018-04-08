var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    domCache: true //enable inline pages
});

myApp.onPageBeforeAnimation('index', function(page) {
    $$("#navTitle").html('مهامي');
    myApp.closePanel();
});

myApp.onPageBeforeAnimation('addTask', function(page) {
    $$("#navTitle").html('أضف مهمة');
    myApp.closePanel();
});

myApp.onPageBeforeAnimation('category', function(page) {
    $$("#navTitle").html('تصنيفات المهمة');
    myApp.closePanel();
});

$$('#addTaskButton').on('click', function(e) {
    if ($$('#minutesInput').val() < 1 || $$('#minutesInput').val() > 59)
        alert('قيمة حقل الدقائق غير صالحة');
    if ($$('#hoursInput').val() < 0 || $$('#hoursInput').val() > 24)
        alert('قيمة حقل الساعة غير صالحة');
});



$$('.delete_category').on('click', function(e) {
    alert("تم الحذف");
});

$$('.prompt-title-ok-cancel').on('click', function() {
    myApp.prompt('ماهو التصنيف الجديد؟', 'إضافة تصنيف',
        function(value) {
            myApp.alert(value, 'القيمة المدخلة هي');
        },
        function(value) {

        }
    );
});

document.addEventListener('deviceready', function() {
    db = window.sqlitePlugin.openDatabase({
        name: 'toDoList.db',
        location: 'default'
    });
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Category (category_id INTEGER PRIMARY KEY AUTOINCREMENT, category_name VARCHAR(50))');

        tx.executeSql('CREATE TABLE IF NOT EXISTS Task (task_id INTEGER PRIMARY KEY AUTOINCREMENT, task_name VARCHAR(50), task_description VARCHAR(500), task_date DATE, task_time VARCHAR(50), task_repetition VARCHAR(50), task_priority VARCHAR(50), task_category_id INT, task_status VARCHAR(50), FOREIGN KEY (task_category_id) REFERENCES Category (category_id))');

    }, function(error) {
        alert('Transaction ERROR: ' + error.message);
    }, function() {
        alert('Populated database OK');
    });
});