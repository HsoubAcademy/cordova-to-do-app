var db;
var myApp = new Framework7();
var $$ = Dom7;
var isEditTask = false;
var task_id;

var mainView = myApp.addView('.view-main', {
    domCache: true
});
myApp.onPageBeforeAnimation('index', function(page) {
    $$("#navTitle").html('مهامي');
    myApp.closePanel();
});

myApp.onPageBeforeAnimation('task', function(page) {
    //جلب جميع التصنيفات
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM Category', [], function(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                var category = '<option value="' + rs.rows.item(i).category_id + '">' + rs.rows.item(i).category_name + '</option>';
                $$("#taskCategoryId").append(category);
            }
        }, function(tx, error) {
            alert('SELECT error: ' + error.message);
        });
    });
    if (!isEditTask) {
        //#navTitle معرف عنوان الترويسة
        $$("#navTitle").html('إضافة المهمة');
        //#taskButton معرف زر إضافة أو تعديل المهمة 
        $$("#taskButton").html('أضف المهمة');
        //#taskButton معرف عنوان إضافة أو تعديل المهمة 
        $$("#taskSubTitle").html('المهمة الحالية');
    } else {
        $$("#navTitle").html('تعديل مهمة');
        $$("#taskButton").html('عدّل المهمة');
        $$("#taskSubTitle").html('المهمة الحالية');
        //جلب معلومات المهمة من قاعدة البيانات ووضعها في الحقول
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Task WHERE task_id = ?', [task_id], function(tx, rs) {
                $$('#taskTitle').val(rs.rows.item(0).task_name);
                $$('#taskDescription').val(rs.rows.item(0).task_description);
                $$('#taskDate').val(rs.rows.item(0).task_date);
                var str = rs.rows.item(0).task_time;
                var res = str.split(":");
                $$('#hoursInput').val(res[0]);
                $$('#minutesInput').val(res[1]);
                $$('#taskRepetition').val(rs.rows.item(0).task_repetition);
                $$('#taskPriority').val(rs.rows.item(0).task_priority);
                $$('#taskCategoryId').val(rs.rows.item(0).task_category_id);
            }, function(tx, error) {
                //alert('SELECT error: ' + error.message);
            });
        });
    }
    myApp.closePanel();
});

myApp.onPageBeforeAnimation('category', function(page) {
    $$("#navTitle").html('تصنيفات المهمة');
    myApp.closePanel();
    //جلب جميع التصنيفات
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM Category', [], function(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                var category = '<li class="category_item" id="' + rs.rows.item(i).category_id + '"><div class="item-content" ><div class="item-media category_arrow"><i class="icon f7-icons">arrow_left</i></div><div class="item-inner" >' + '<div class="item-title" id="category_name' + rs.rows.item(i).category_id + '">' + rs.rows.item(i).category_name + '</div>' + '<div class="item-after delete_category">' + '<i class="icon f7-icons">delete_round</i>' + '</div></div></div></li>';
                $$("#allCategories").append(category);
            }
            setCategoryClickEvents();
        }, function(tx, error) {
            alert('SELECT error: ' + error.message);
        });
    });
});

//إضافة المهمة
$$('#taskButton').on('click', function(e) {
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
    if (!isEditTask) {
        // إضافة مهمة جديدة
        db.executeSql('INSERT INTO Task ("task_name", "task_description", "task_date", "task_time", "task_repetition", "task_priority", "task_category_id", "task_status") VALUES (?, ?, ?, ?, ?, ?, ?, ? )', [taskTitle, taskDescription, taskDate, taskTime, taskRepetition, taskCategoryId, taskPriority, "Pending"], function(resultSet) {
            alert('تمت الإضافة');
            mainView.router.load({ pageName: 'index' });
        }, function(error) {
            alert('SELECT error: ' + error.message);
        });
    } else {
        //تعديل معلومات مهمة
        db.executeSql('UPDATE Task SET "task_name" = ?, "task_description" = ?, "task_date" = ?, "task_time" = ?, "task_repetition" = ?, "task_priority" = ?, "task_category_id" = ?, "task_status" = ? WHERE "task_id" = ?', [taskTitle, taskDescription, taskDate, taskTime, taskRepetition, taskCategoryId, taskPriority, "Pending", task_id], function(resultSet) {
            //الذهاب إلى الصفحة الرئيسية بعد تعديل المهمة
            mainView.router.load({ pageName: 'index' });
        }, function(error) {
            alert('SELECT error: ' + error.message);
        });
    }
});

//task_item حدث الضغط على العنصر الذي يحمل الصنف
function setClickEvent() {
    $$('.task_item').on('click', function(e) {
        task_id = $$(this).attr('id');
        isEditTask = true;
        if ($$(e.target).hasClass('delete_task')) {
            return;
        }
        //الانتقال إلى صفحة تعديل المهمة
        mainView.router.load({ pageName: 'task' });
    });
    //.delete_task صنف زر حذف المهمة
    $$('.delete_task').on('click', function(e) {
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM Task WHERE task_id = ?', [task_id], function(tx, rs) {
                $$('#' + task_id).hide();
            }, function(tx, error) {
                alert('Error: ' + error.message);
            });
        });
    });

}

function setCategoryClickEvents() {
    //حدث الضغط على التصنيف
    $$('.category_item').on('click', function(e) {
        var category_id = $$(this).attr('id');
        myApp.prompt('ما هو الاسم الجديد للتصنيف؟', 'تعديل التصنيف',
            function(value) {
                db.executeSql('UPDATE Category SET "category_name" = ? WHERE "category_id" = ?', [value, category_id], function(resultSet) {
                    alert("تم تعديل اسم التصنيف");
                    $$("#category_name" + category_id).html(value);
                }, function(error) {
                    alert('UPDATE error: ' + error.message);
                });
            }
        );
    })
}

//.addNewTask الضغط على زر أضف مهمة
$$('.addNewTask').on('click', function(e) {
    isEditTask = false;
});

$$('.delete_category').on('click', function(e) {
    alert("تم الحذف");
});

//حدث الضغط على زر إضافة تصنيف
$$('.prompt-title-ok-cancel').on('click', function() {
    myApp.prompt('ماهو التصنيف الجديد؟', 'إضافة تصنيف',
        function(value) {
            db.executeSql('INSERT INTO Category (category_name)  VALUES (?)', [value], function(resultSet) {
                alert("تمت إضافة التصنيف");
            }, function(error) {
                alert('INSERT error: ' + error.message);
            });
        },
        function(value) {

        }
    );
});


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
                var task = '<li class="task_item" id="' + rs.rows.item(i).task_id + '"><div class="item-content"><div class="item-media">' +
                    '<img style="height: 30px; width: 30px" src="img/task.png" /></div>' + '<div class="item-inner"> <div class="item-title">' + rs.rows.item(i).task_name + '</div>' +
                    '<div class="item-after">' + rs.rows.item(i).task_priority + '<i class="delete_task icon f7-icons">delete_round</i> </div>' + '</div></div></li>';
                $$("#allTasks").append(task);
            }
            setClickEvent();
        }, function(error) {
            alert('SELECT error: ' + error.message);
        });

    }, function(error) {
        //alert('Transaction ERROR: ' + error.message);
    }, function() {
        //alert('Populated database OK');
    });

});