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
                "1" : "15:00-18:30"
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
            workTime: 'true',
            bgcolor: '#abc',
            // {index :  name, : index: name,,..}
            selectBox: {
                "1" : "A",
                "3" : "Mr.Jason",
                "25" : "Mrs.Jason"
            }
        }};

        // Call Time Table
        var instance = new TimeTable(obj);
        instance.init('#TimeTable');
    });
