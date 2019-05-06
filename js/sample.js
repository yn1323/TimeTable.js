"use strict";
// {index : { name : { color : time, ...}}}
let shiftObj = {
    "1" : {
        "Mrs. Tomato": [
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
        "Jedi": [
            {"8" : "13:00-19:00"}
        ]
    },
    "3" : {
        "Skywalker": [
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
        "Mario": [
            {"1" : "12:00-15:30"}
        ]
    },
    "6" : {
        "Tom": [
            {"0" : "15:00-22:30"}
        ]
    },
    "7" : {
        "Michael": [
            {"9" : "15:00-18:30"}
        ]
    },
    "8" : {
        "Pikachu": [
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
    divTime: "15",
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
            "35" : "Jason Paige",
            "18" : "Mr.Jason",
            "25" : "Mrs.Jason",
            "38" : "A",
            "39" : "B",
            "40" : "C"
        },
        // Set false if you want the rows to be static i.e. as defined in your shift object
        deleteRows: true,
        // Set true when using TimeTable inside of BootStrap class row
        useBootstrap: false,
    }
};
// Call Time Table
var instance = new TimeTable(obj);
console.time("time"); // eslint-disable-line
instance.init("#test");
console.timeEnd("time");// eslint-disable-line

// Only works if selectBox option exist
$(document).on("click", "#addRow",()=>{instance.addRow();});

// Change theme color sample
$(document).on("click","#colorChange", ()=>{
    let color = `${getColor()},${getColor()},${getColor()}`;
    document.documentElement.style.setProperty("--rgbTheme", color);
});
function getColor(){
    return Math.floor(Math.random() * Math.floor(255));
}
// Getting Data Sample
$(document).on("click","#getData", ()=>{
    let data = instance.data();
    console.log(data);
});
