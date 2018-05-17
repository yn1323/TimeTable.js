$(() => {
    "use strict";
    // {index : { name : { color : time, ...}}}
    let shiftObj = {
        "1" : {
            "ウンババ": [
                {"1" : "10:00-12:00"},
                {"2" : "13:00-14:00"},
                {"9" : "17:00-20:00"},
            ]
        },
        "2" : {
            "Jason Paige": [
                {"3" : "11:00-12:45"},
                {"5" : "14:00-19:30"},
            ]
        },
        "500" : {
            "アカウミガメ": [
                {"8" : "13:00-19:00"}
            ]
        },
        "3" : {
            "ウンババ2号": [
                {"1" : "10:00-12:00"},
                {"2" : "13:00-14:00"},
                {"9" : "17:00-20:00"},
            ]
        },
        "4" : {
            "Mrs.Smith": [
                {"8" : "10:00-13:30"},
                {"7" : "14:00-17:30"},
            ]
        },
        "5" : {
            "ヘイホー": [
                {"1" : "12:00-15:30"}
            ]
        },
        "6" : {
            "村上春樹": [
                {"0" : "15:00-22:30"}
            ]
        },
        "7" : {
            "村下夏樹": [
                {"9" : "15:00-18:30"}
            ]
        },
        "8" : {
            "波乗りピカチュウ": [
                {"1" : "10:00-12:00"},
                {"2" : "13:00-14:00"},
                {"3" : "17:00-20:30"},
            ]
        },
        "9" : {
            "MR.JSON": [
                {"2" : "09:00-12:59"},
                {"4" : "15:00-15:20"},
                {"7" : "17:00-17:30"},
            ]
        },
    };
    let obj = {
        // Beginning Time
        startTime: "09:00",
        // Ending Time
        endTime: "20:00",
        // Time to divide(minute)
        divTime: "30",
        // Time Table
        shift: shiftObj,
        // Other options
        option: {
            // workTime include time not displaying
            workTime: true,
            bgcolor: ["#00FFFF"],
            // {index :  name, : index: name,,..}
            // selectBox index and shift index should be same
            // Give randome if shift index was not in selectBox index
            selectBox: {
                "2" : "Jason Paige",
                "3" : "Mr.Jason",
                "25" : "Mrs.Jason"
            }
        }
    };
    /*
    // Call Time Table
    var instance = new TimeTable(obj);
    console.time("time"); // eslint-disable-line
    instance.init("#test");
    console.timeEnd("time");// eslint-disable-line
    */

    // Call Time Table
    var instance2 = new TimeTable(obj);
    console.time("time"); // eslint-disable-line
    instance2.init("#test");
    console.timeEnd("time");// eslint-disable-line
});
