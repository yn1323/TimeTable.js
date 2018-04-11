$(() => {
    'use strict';
    // {index : { name : { color : time, ...}}}
    let shiftObj = {
        "1" : {
            "A": {
                "1" : "10:00-12:00",
                "2" : "13:00-14:00"
            }
        },
        "2" : {
            "B": {
                "3" : "11:00-12:45"
            }
        },
        "500" : {
            'C': {
                "1" : "11:00-12:45"
            }
        }
    }
    let obj = {
        // Beginning Time
        startTime: '21:00',
        // Ending Time
        endTime: '20:00',
        // Time to divide(minute)
        divTime: '15',
        // Time Table
        shift: shiftObj,
        // Other options
        option: {
            worktime: true,
            bgcolor: '#abc'
        }};

        // Call Time Table
        var instance = new TimeTable(obj);
        let shift = {};
        //var a = new Validation(obj);
        //console.log(a.shiftValidation(shiftObj));
    });
