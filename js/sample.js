$(() => {
    'use strict';

    let obj = {
        // Beginning Time
        startTime: '21:00',
        // Ending Time
        endTime: '20:00',
        // Time to divide(minute)
        divTime: '15',
        // Time Table
        shift: {
            'N': '10:00-23:00',
            'B': '11:00-12:45'
        },
        // Other options
        option: {
            worktime: true,
            bgcolor: '#abc'
        }};

        // Call Time Table
        var instance = new TimeTable(obj);

        //var a = new Validation(obj);
        //console.log(a.checkEndTime('12:00'));
    });
