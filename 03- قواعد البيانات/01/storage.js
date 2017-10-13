//طرق التخزين
//LocalStorage
var storage = window.localStorage;
storage.setItem("person1", "Ahmad");
var value = storage.getItem("person1");
storage.removeItem("person1");

//WebSQL
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
//إنشاء أو فتح قاعدة البيانات

db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)');
    // إنشاء جدول يحتوي على حقلين
    tx.executeSql('INSERT INTO LOGS (id, log) VALUES (1, "foobar")');
    // إضافة أول سطر للجدول
    tx.executeSql('INSERT INTO LOGS (id, log) VALUES (2, "logmsg")');
    // إضافة السطر الثاني للجدول
});

//IndexedDB

function add() {
    var request = db.transaction(["employee"], "readwrite")
        // هنا أنشأنا قاعدة بيانات
        .objectStore("employee")
        // هنا أنشانا جدولاً ضمن قاعدة البيانات
        .add({ id: "01", name: "prasad", age: 24, email: "prasad@tutorialspoint.com" });
    // هكذا تتم إضافة البيانات ونلاحظ أنها على شكل قيمة ومفتاح

    request.onsuccess = function(event) {
        alert("Prasad has been added to your database.");
    };

    request.onerror = function(event) {
        alert("Unable to add data\r\nPrasad is already exist in your database! ");
    }
}