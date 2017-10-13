/* Global Variables */
//SQLite Database Var
var db;
//Framework7 Var
var myApp = new Framework7();
//Framework7 Dom var
var $$ = Dom7;
//Check if is Edit Task Page
var isEditTask = false;
//Task Id
var task_id;
//Enable Framework7 Inline Pages
var mainView = myApp.addView('.view-main', {
    domCache: true
});

/* Events */
//Home Page Load Event
myApp.onPageBeforeAnimation('index', function(page) {
    //#navTitle Id of Page Header Title
    $$("#navTitle").html('مهامي');
    //Close Side Menu
    myApp.closePanel();
});

//Add Task Page Load Event
myApp.onPageBeforeAnimation('addTask', function(page) {
    if (!isEditTask) {
        //#navTitle Id of Page Header Title
        $$("#navTitle").html('إضافة المهمة');
        //#addTaskButton Id of "Add Task" Button 
        $$("#addTaskButton").html('أضف المهمة');
        //#addTaskSubTitle Id of Sub Title 
        $$("#addTaskSubTitle").html('المهمة جديدة');
    } else {
        $$("#navTitle").html('تعديل مهمة');
        $$("#addTaskButton").html('عدّل المهمة');
        $$("#addTaskSubTitle").html('المهمة الحالية');
        //Get Task From Database
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Task WHERE task_id = ?', [task_id], function(tx, rs) {
                //Set Inputs Value For Task From Database
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

//Category Page Load Event
myApp.onPageBeforeAnimation('category', function(page) {
    $$("#navTitle").html('تصنيفات المهمة');
    myApp.closePanel();
});

//"Add Task" Button Click Event
//.addNewTask Class of "Add Task" Button In Main Page
$$('.addNewTask').on('click', function(e) {
    isEditTask = false;
});

//Task Item Click Event
//#task_item Class of Each Task Item in Home Page
function setClickEvent() {
    $$('.task_item').on('click', function(e) {
        task_id = $$(this).attr('id');
        isEditTask = true;
        if ($$(e.target).hasClass('delete_task')) {
            return;
        }
        //Move to Add Task Page
        mainView.router.load({ pageName: 'addTask' });
    });
    //"Delete TasK" Button Click Event
    //.delete_task Class of "Delete Task" Button 
    $$('.delete_task').on('click', function(e) {
        //Delete Task From Database
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM Task WHERE task_id = ?', [task_id], function(tx, rs) {
                $$('#' + task_id).hide();
            }, function(tx, error) {
                //alert('Error: ' + error.message);
            });
        });
    });
}

//"Delete Category" Button Click Event
$$('.delete_category').on('click', function(e) {
    alert("تم الحذف");
});

//"Add Category" Button Click Event
$$('.prompt-title-ok-cancel').on('click', function() {
    myApp.prompt('ماهو التصنيف الجديد؟', 'إضافة تصنيف',
        function(value) {
            db.executeSql('INSERT INTO Category (category_name)  VALUES (?)', [value], function(resultSet) {
                alert("تمت إضافة التصنيف");
            }, function(error) {
                alert('INSERT error: ' + error.message);
            });
        }
    );
});

/* Database Part */
//"Add TasK" Button Click Event
//#addTaskButton Id of "Add Task" Button 
$$('#addTaskButton').on('click', function(e) {
    //Validate Inputs Values
    if ($$('#minutesInput').val() < 1 || $$('#minutesInput').val() > 59) {
        alert('قيمة حقل الدقائق غير صالحة');
        return;
    }
    if ($$('#hoursInput').val() < 0 || $$('#hoursInput').val() > 24) {
        alert('قيمة حقل الساعة غير صالحة');
        return;
    }
    //Get All Fields Values
    var taskTitle = $$('#taskTitle').val();
    var taskDescription = $$('#taskDescription').val();
    var taskDate = $$('#taskDate').val();
    var taskTime = $$('#hoursInput').val() + ": " + $$('#minutesInput').val();
    var taskRepetition = $$('#taskRepetition').val();
    var taskCategoryId = $$('#taskCategoryId').val();
    var taskPriority = $$('#taskPriority').val();

    if (!isEditTask) {
        //Insert All Fields Values in Task Table In Database
        db.executeSql('INSERT INTO Task ("task_name", "task_description", "task_date", "task_time", "task_repetition", "task_priority", "task_category_id", "task_status") VALUES (?, ?, ?, ?, ?, ?, ?, ? )', [taskTitle, taskDescription, taskDate, taskTime, taskRepetition, taskCategoryId, taskPriority, "Pending"], function(resultSet) {
            //Move to Home Page When Insert Operation Success
            mainView.router.load({ pageName: 'index' });
        }, function(error) {
            //alert('SELECT error: ' + error.message);
        });
    } else {
        //Update All Fields Values in Task Table In Database
        db.executeSql('UPDATE Task SET "task_name" = ?, "task_description" = ?, "task_date" = ?, "task_time" = ?, "task_repetition" = ?, "task_priority" = ?, "task_category_id" = ?, "task_status" = ? WHERE "task_id" = ?', [taskTitle, taskDescription, taskDate, taskTime, taskRepetition, taskCategoryId, taskPriority, "Pending", task_id], function(resultSet) {
            //Move to Home Page When Update Operation Success
            mainView.router.load({ pageName: 'index' });
        }, function(error) {
            //alert('SELECT error: ' + error.message);
        });
    }

});

//deviceready Event
document.addEventListener('deviceready', function() {
    //Create or Open Database
    db = window.sqlitePlugin.openDatabase({
        name: 'toDoList.db',
        location: 'default'
    });
    db.transaction(function(tx) {
        //Create Tables if Not Exist 
        tx.executeSql('CREATE TABLE IF NOT EXISTS Category (category_id INTEGER PRIMARY KEY AUTOINCREMENT, category_name VARCHAR(50))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS Task (task_id INTEGER PRIMARY KEY AUTOINCREMENT, task_name VARCHAR(50), task_description VARCHAR(500), task_date DATE, task_time VARCHAR(50), task_repetition VARCHAR(50), task_priority VARCHAR(50), task_category_id INT, task_status VARCHAR(50),  FOREIGN KEY (task_category_id) REFERENCES Category (category_id))');
        //Get All Tasks
        tx.executeSql('SELECT * FROM Task', [], function(tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
                var task = '<li class="task_item" id="' + rs.rows.item(i).task_id + '"><div class="item-content"><div class="item-media">' +
                    '<img style="height: 30px; width: 30px" src="img/task.png" /></div>' + '<div class="item-inner"> <div class="item-title">' + rs.rows.item(i).task_name + '</div>' +
                    '<div class="item-after">' + rs.rows.item(i).task_priority + '<i class="delete_task icon f7-icons">delete_round</i> </div>' + '</div></div></li>';
                //Add Tasks To Home Page List
                $$("#allTasks").append(task);
            }
            setClickEvent();
        }, function(error) {
            //alert('SELECT error: ' + error.message);
        });
    }, function(error) {
        //alert('Transaction ERROR: ' + error.message);
    }, function() {
        //alert('Populated database OK');
    });
});