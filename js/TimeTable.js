'use strict'
// Main class for TimeTable.js
class TimeTable{
    constructor(data,option={}){
        this.v = new Validation(data);
        this.startTime  = data['startTime']; // Beginning Time
        this.endTime    = data['endTime'];   // Endint Time
        this.divTime    = data['divTime'];   // Unit to Divide time(minutes)
        this.shift      = data['shift'];     // Time Table Data
        //this.setOptions = this.setOptions(option); // Other option
        console.log(this.startTime,this.endTime,this.divTime);
    }
    get startTime() {return this.START_TIME}
    set startTime(x){if(this.v.checkStartTime(x))this.START_TIME = this.v.checkStartTime(x)}
    get endTime  (){return this.END_TIME  }
    set endTime  (x){if(this.v.checkEndTime(x))  this.END_TIME   = this.v.checkEndTime(x)  }
    get divTime  (){return this.DIV_TIME  }
    set divTime  (x){if(this.v.checkDivTime(x))  this.DIV_TIME   = this.v.checkDivTime(x)  }
    get shiftTime(){return this.SHIFT     }
    set shiftTime(x){this.SHIFT      = this.v.checkShiftTime(x)}

    /*
    Set option of this library
    @param  obj : option objects simply user enters
    @return obj : option objects defult value users's option included
    */
    setOptions(obj){
        // Initial value of options

    }
}

// Class to manage messages
class Message{
    constructor(){
        // Messages for Error
        this.ermsg = {};
        this.setErrorMessage();
    }
    /*
    To set Error Message
    */
    setErrorMessage(){
        // About Time
        this.ermsg['TIME_LENGTH']       = "TIME LENGTH IS NOT 5. IT HAS TO BE FORMAT OF 'HH:MM'";
        this.ermsg['TIME_DELIMETER']    = "DELIMETER SHOULD BE ':' in 3rd character";
        this.ermsg['TIME_HOUR_RANGE']   = "HOUR HAS TO BE BETWEEN 00 to 23";
        this.ermsg['TIME_MINUTE_RANGE'] = "MINUTS HAS TO BE BETWEEN 00 to 59";
        this.ermsg['DIVTIME_RANGE']     = "DIV TIME HAS TO BE BETWEEN 1 to 60";
        // About Data Type
        this.ermsg['STRING_DATA_TYPE'] = "HAS TO BE STRING";
        this.ermsg['NOT_NUMBER']       = "HAS TO BE NUMBER";
    }
}

// Class to check validations
class Validation extends Message{
    constructor(data){
        super();
        this.data = data;
        this.calc = new Calculation();
        this.START_TIME = 0;
        this.END_TIME   = 0;
        this.DIV_TIME   = 0;
    }
    /*
    Check starting time
    @param  {string} time :
    @return {number}      : Number converted into minutes
    */
    checkStartTime(time){
        // Validation
        if(!this.timeValidation(time))return false;
        let intTime = this.calc.time2Int(time);
        // Only when required 24 hours time schedule
        if(this.data['startTime'] === this.data['endTime']){
            intTime = 0;
        }
        this.START_TIME = intTime;
        return intTime;
    }
    /*
    Check ending time
    @param  {string} time :
    @return {number}      : Number converted into minute
    */
    checkEndTime(time){
        if(!this.timeValidation(time))return false;
        let intTime = this.calc.time2Int(time);
        // Only when required 24 hours time schedule
        if(this.data['startTime'] === this.data['endTime']){
            intTime = 0;
        }
        // When schedule needs to set after 00:00.
        if(this.START_TIME > intTime){
            // Add 24 hours converted as minute
            intTime += 1440;
        }
        this.END_TIME = intTime;
        return intTime;
    }
    /*
    Validation of DivTime
    @param  {string} divTime : Unit to create Time Table(Minute)
    @return {number} num     : Unit to create Time Table(Minute)
    */
    checkDivTime(divTime){
        if(!this.divTimeValidation(divTime))return false;
        const intDivTime = parseInt(divTime,10);
        this.DIV_TIME = intDivTime;
        return intDivTime;
    }
    checkShiftTime(a){

        return a;
    }
    /*
    Check format of time
    @param  {string}   time : Time (HH:MM)
    @return {boolean} true  : No Error.
                      false : Has Error.
    */
    timeValidation(time){
        // flag to detect error(true: No error, false: Has error)
        let flg = true;
        try{
            // Data type check
            if(typeof(time) !== 'string')throw new Error(this.ermsg['STRING_DATA_TYPE']);
            // Lack or too much length
            if(time.length !== 5)throw new Error(this.ermsg['TIME_LENGTH']);
            // Delimiter check
            if(time.substring(2,3) !== ':')throw new Error(this.ermsg['TIME_DELIMETER']);
            const hour   = time.substring(0,2);
            const minute = time.substring(3,5);
            // Check whether hour and minute are number
            if(isNaN(hour)||isNaN(minute))throw new Error(this.ermsg['NOT_NUMBER']);
            const intHour   = parseInt(hour,10);
            const intMinute = parseInt(minute,10);
            // Check Range of hour
            if(!(intHour >= 0 && intHour < 24))throw new Error(this.ermsg['TIME_HOUR_RANGE']);
            // Check Range of minute
            if(!(intMinute >= 0 && intMinute < 60))throw new Error(this.ermsg['TIME_MINUTE_RANGE']);
        }catch(e){
            console.error(e + ' => ' + time);
            flg = false;
        }
        return flg;
    }
    /*
    Check format of divTime
    @param  {string} divTime : Unit to create Time Table(Minute)
    @return {boolean} true  : No Error.
                      false : Has Error.
    */
    divTimeValidation(divTime){
        let flg = true;
        try{
            // Data type check
            if(typeof(divTime) !== 'string')throw new Error(this.ermsg['STRING_DATA_TYPE']);
            // Check whether hour and minute are number
            if(isNaN(divTime))throw new Error(this.ermsg['NOT_NUMBER']);
            // Check Range of minute
            const intDivTime = parseInt(divTime,10);
            if(!(intDivTime > 0 && intDivTime <= 60))throw new Error(this.ermsg['DIVTIME_RANGE']);
        }catch(e){
            console.error(e + ' => ' + divTime);
            flg = false;
        }
        return flg;
    }
}

// Class for calculation
class Calculation{
    /*
    Convert time working time into minutes
    If ending time passes 00:00, add 1440(24H) to returning minutes.
    @param  {string} time : Format should be "HH:MM-HH:MM".
    @example : let [s,e] = twoTime2Int('10:00-23:00')
    @return  {int} startTime : Starting time converted as minutes
    {int} endTime   : Ending time converted as minutes
    */
    twoTime2Int(time){
        // Starting Time
        let sTime = this.time2Int(time.substring(0,4));
        // Ending Time
        let eTime = this.time2Int(time.substring(6,10));
        // Process for Ending Time exceeds 00:00
        if(sTime > eTime){
            // Minute of 24 hours * 60 minute
            eTime += 1440;
        }
        return [sTime, eTime];
    }
    /*
    convert time into integer
    @param  {string} time : Format should be "HH:MM".
    @example : time2Int('23:45')
    @return  {int}        : Time converted as minutes
    @example : 1425
    */
    time2Int(time,option){
        // Hour
        const h = time.substring(0,2);
        // Minute
        const m = time.substring(3,5);
        return (parseInt(h,10) * 60 + parseInt(m,10));
    }
    /*
    convert time into integer
    @param  {int}   time : Time converted as minutes
    @example : int2Time(1425)
    @return  {string} returnTime : Format should be "HH:MM".
    @example : 23:45
    */
    int2Time(time){
        // Hour
        let h = Math.floor(time / 60);
        // Minute
        let m = time % 60;
        // Add 0 when only 1 digit
        return (this.toDoubleDigits(h) + ':' +  this.toDoubleDigits(m))
    }
    /*
    Add 0 to number if it is only 1 digit
    @param  {int}    num : Number.
    @return {string} num : Number with 0.
    */
    toDoubleDigits(num) {
        num += "";
        if (num.length === 1) {
            num = "0" + num;
        }
        return num;
    }
}
