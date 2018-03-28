var db;
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
    refreshMainPage();
});

myApp.onPageBeforeAnimation('category', function(page) {
    $$("#navTitle").html('تصنيفات المهمة');
    myApp.closePanel();
});

$$('#addTaskButton').on('click', function(e) {
    var taskTitle = $$('#taskTitle').val();
    var taskDescription = $$('#taskDescription').val();
    var taskDate = $$('#taskDate').val();
    var taskTime = $$('#hoursInput').val() + ": " + $$('#minutesInput').val();
    var taskRepetition = $$('#taskRepetition').val();
    var taskCategoryId = $$('#taskCategoryId').val();
    var taskPriority = $$('#taskPriority').val();


    if ($$('#minutesInput').val() < 0 || $$('#minutesInput').val() > 59) {
        alert('قيمة حقل الدقائق غير صالحة');
        return;
    }
    if ($$('#hoursInput').val() < 0 || $$('#hoursInput').val() > 23) {
        alert('قيمة حقل الساعة غير صالحة');
        return
    }

    db.executeSql('INSERT INTO Task ("task_name", "task_description", "task_date", "task_time", "task_repetition", "task_priority", "task_category_id", "task_status") VALUES (?, ?, ?, ?, ?, ?, ?, ? )', [taskTitle, taskDescription, taskDate, taskTime, taskRepetition, taskCategoryId, taskPriority, "Pending"], function(resultSet) {
        alert('تمت الإضافة');
        mainView.router.load({ pageName: 'index' });
    }, function(error) {
        alert('SELECT error: ' + error.message);
    });
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

function refreshMainPage() {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM Task', [], function(tx, rs) {
            $$("#allTasks").html("");
            for (var i = 0; i < rs.rows.length; i++) {
                var task = '<li class="task_item" id="' + rs.rows.item(i).task_id + '"><div class="item-content"><div class="item-media">' +
                    '<img style="height: 30px; width: 30px" src="img/task.png" /></div>' + '<div class="item-inner"> <div class="item-title">' + rs.rows.item(i).task_name + '</div>' +
                    '<div class="item-after">' + rs.rows.item(i).task_priority + '<i class="delete_task icon f7-icons">delete_round</i> </div>' + '</div></div></li>';
                $$("#allTasks").append(task);
            }
            setClickEvent();
        }, function(tx, error) {
            alert('SELECT error: ' + error.message);
        });
    });
}

document.addEventListener('deviceready', function() {
    //إنشاء أو فتح قاعدة البيانات
    db = window.sqlitePlugin.openDatabase({
        name: 'toDoList.db',
        location: 'default'
    });

    db.transaction(function(tx) {
        //إنشاء الجداول إن لم تكن منشأة
        tx.executeSql('CREATE TABLE IF NOT EXISTS Category (category_id INT NOT NULL, category_name VARCHAR(50), PRIMARY KEY (category_id))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Task (task_id INT NOT NULL, task_name VARCHAR(50), task_description VARCHAR(500), task_date DATE, task_time VARCHAR(50), task_repetition VARCHAR(50), task_priority VARCHAR(50), task_category_id INT, task_status VARCHAR(50), PRIMARY KEY (task_id), FOREIGN KEY (task_category_id) REFERENCES Category (category_id))');
        //جلب جميع المهام
        tx.executeSql('SELECT * FROM Task', [], function(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                var task = '<li><div class="item-content"><div class="item-media">' +
                    '<img style="height: 30px; width: 30px" src="img/task.png" /></div>' + '<div class="item-inner"> <div class="item-title">' + rs.rows.item(i).task_name + '</div>' +
                    '<div class="item-after">' + rs.rows.item(i).task_priority + '</div>' + '</div></div></li>';
                $$("#allTasks").append(task);
            }

        }, function(error) {
            alert('SELECT error: ' + error.message);
        });
    }, function(error) {
        //alert('Transaction ERROR: ' + error.message);
    }, function() {
        //alert('Populated database OK');
    });

});