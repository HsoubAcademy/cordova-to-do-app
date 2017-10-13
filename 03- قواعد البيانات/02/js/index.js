var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    domCache: true
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
    if ($$('#minutesInput').val() < 0 || $$('#minutesInput').val() > 59)
        alert('قيمة حقل الدقائق غير صالحة');
    if ($$('#hoursInput').val() < 0 || $$('#hoursInput').val() > 23)
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
    //إنشاء أو فتح قاعدة البيانات
    db = window.sqlitePlugin.openDatabase({
        name: 'demo.db',
        location: 'default'
    });
    db.transaction(function(tx) {
        //إنشاء الجدول
        tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (id, name, score)');
        //إضافة البيانات 
        //tx.executeSql('INSERT INTO DemoTable VALUES (?,?,?)', [1, 'Ahmad', 101]);
        //tx.executeSql('INSERT INTO DemoTable VALUES (?,?,?)', [2, 'Omar', 202]);
        //تعديل الاسم في السطر الأول
        // tx.executeSql('UPDATE DemoTable Set name = ? Where id = ?', ['Mohammd', 1]);
        //حذف السطر الأول
        tx.executeSql('DELETE FROM DemoTable  Where id = ?', [1]);
        //جلب جميع الأسطر
        tx.executeSql('SELECT name FROM DemoTable', [], function(tx, rs) {
            alert(rs.rows.length); //عدد الأسطر التي أعادتها التعليمة
            alert('Name: ' + rs.rows.item(0).name);
        }, function(tx, error) {
            alert('SELECT error: ' + error.message);
        });
    }, function(error) {
        alert('Transaction ERROR: ' + error.message);
    }, function() {
        alert('Populated database OK');
    });
});